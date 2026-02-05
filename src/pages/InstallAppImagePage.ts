import Adw from "@girs/Adw";
import Gtk from "@girs/Gtk";
import Pango from "@girs/Pango";
import { HOME, SPACING } from "~/constants.ts";
import { Page } from "~/components/Page.ts";
import { buttonClass } from "~/libs/utils/buttonClass.ts";
import { html } from "~/libs/utils/markup.ts";
import { formatBytes } from "~/libs/utils/format.ts";
import * as path from "@std/path";

export type InstallAppImagePageOptions = {
	appImagePath: string;
	onInstalled?: () => void;
};

export function InstallAppImagePage(options: InstallAppImagePageOptions) {
	const { appImagePath, onInstalled } = options;
	const self = Page();

	const fileName = path.basename(appImagePath);
	const fileStats = Deno.statSync(appImagePath);

	const header = Gtk.Box.new(Gtk.Orientation.HORIZONTAL, SPACING * 1.5);
	const headerContent = Gtk.Box.new(Gtk.Orientation.VERTICAL, 0);
	headerContent.set_valign(Gtk.Align.CENTER);
	header.append(headerContent);

	const icon = Gtk.Image.new();
	icon.set_from_icon_name("application-x-executable-symbolic");
	icon.set_pixel_size(120);
	header.prepend(icon);

	const title = Gtk.Label.new();
	title.set_halign(Gtk.Align.START);
	title.set_wrap(true);
	title.set_wrap_mode(Pango.WrapMode.WORD_CHAR);
	title.set_markup(html`
		<span size="x-large"><b>${fileName}</b></span>
	`);
	title.set_margin_bottom(SPACING * 0.25);
	headerContent.append(title);

	const subtitle = Gtk.Label.new();
	subtitle.set_halign(Gtk.Align.START);
	subtitle.set_wrap(true);
	subtitle.set_wrap_mode(Pango.WrapMode.WORD_CHAR);
	subtitle.set_opacity(0.65);
	subtitle.set_markup(html`
		<small>AppImage • ${formatBytes(fileStats.size)}</small>
	`);
	headerContent.append(subtitle);

	self.container.append(header);

	// Info group
	const infoGroup = Adw.PreferencesGroup.new();
	infoGroup.set_title("File Information");
	self.container.append(infoGroup);

	const sourceRow = Adw.ActionRow.new();
	sourceRow.set_title("Source");
	sourceRow.set_subtitle(appImagePath);
	sourceRow.set_subtitle_selectable(true);
	infoGroup.add(sourceRow);

	const sizeRow = Adw.ActionRow.new();
	sizeRow.set_title("Size");
	sizeRow.set_subtitle(formatBytes(fileStats.size));
	infoGroup.add(sizeRow);

	// Installation options group
	const installGroup = Adw.PreferencesGroup.new();
	installGroup.set_title("Installation Options");
	installGroup.set_description("Choose where to install the AppImage");
	self.container.append(installGroup);

	const defaultAppsDir = path.join(HOME, "Applications");
	const destinationEntry = Adw.EntryRow.new();
	destinationEntry.set_title("Destination folder");
	destinationEntry.set_text(defaultAppsDir);
	installGroup.add(destinationEntry);

	const createLauncherSwitch = Adw.SwitchRow.new();
	createLauncherSwitch.set_title("Create desktop launcher");
	createLauncherSwitch.set_subtitle("Add a .desktop file to your applications menu");
	createLauncherSwitch.set_active(true);
	installGroup.add(createLauncherSwitch);

	const portableHomeSwitch = Adw.SwitchRow.new();
	portableHomeSwitch.set_title("Create portable home folder");
	portableHomeSwitch.set_subtitle("Store app data alongside the AppImage");
	portableHomeSwitch.set_active(false);
	installGroup.add(portableHomeSwitch);

	// Action buttons
	const buttonBox = Gtk.Box.new(Gtk.Orientation.HORIZONTAL, SPACING);
	buttonBox.set_halign(Gtk.Align.CENTER);
	buttonBox.set_margin_top(SPACING);
	self.container.append(buttonBox);

	const installButton = Gtk.Button.new();
	installButton.set_label("Install");
	installButton.set_css_classes(buttonClass("suggested-action"));
	installButton.connect("clicked", () => {
		const destinationDir = destinationEntry.get_text();
		const destinationPath = path.join(destinationDir, fileName);

		try {
			// Ensure destination directory exists
			Deno.mkdirSync(destinationDir, { recursive: true });

			// Copy AppImage to destination
			Deno.copyFileSync(appImagePath, destinationPath);

			// Make it executable
			Deno.chmodSync(destinationPath, 0o755);

			// Create portable home folder if requested
			if (portableHomeSwitch.get_active()) {
				const portableHomePath = `${destinationPath}.home`;
				Deno.mkdirSync(portableHomePath, { recursive: true });
			}

			// Create desktop launcher if requested
			if (createLauncherSwitch.get_active()) {
				const launchersDir = path.join(HOME, ".local", "share", "applications");
				Deno.mkdirSync(launchersDir, { recursive: true });

				const appName = fileName.replace(/\.appimage$/i, "").replace(/[-_]/g, " ");
				const desktopFileName = fileName.replace(/\.appimage$/i, ".desktop").replace(/\s+/g, "-");
				const desktopFilePath = path.join(launchersDir, desktopFileName);

				const desktopContent = `[Desktop Entry]
Type=Application
Name=${appName}
Exec="${destinationPath}"
Icon=application-x-executable
Terminal=false
Categories=Utility;
`;
				Deno.writeTextFileSync(desktopFilePath, desktopContent);
			}

			onInstalled?.();

			// Show success toast or notification
			console.log(`AppImage installed to: ${destinationPath}`);
		} catch (error) {
			console.error("Installation failed:", error);
		}
	});
	buttonBox.append(installButton);

	const runButton = Gtk.Button.new();
	runButton.set_label("Run Without Installing");
	runButton.connect("clicked", () => {
		// Make sure it's executable
		Deno.chmodSync(appImagePath, 0o755);

		const cmd = new Deno.Command("bash", {
			args: ["-c", `nohup "${appImagePath}" >/dev/null 2>&1 &`],
		});
		cmd.spawn().unref();
	});
	buttonBox.append(runButton);

	return self;
}
