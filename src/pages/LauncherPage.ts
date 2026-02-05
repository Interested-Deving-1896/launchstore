import Gtk from "@girs/Gtk";
import Pango from "@girs/Pango";
import { SPACING } from "~/src/constants.ts";
import { formatLauncherTypeName, Launcher } from "~/src/libs/launchers.ts";
import { html } from "~/src/libs/utils/markup.ts";
import { Page } from "~/src/components/Page.ts";
import { buttonClass } from "~/src/libs/utils/buttonClass.ts";
import { AppImageGroups } from "~/src/components/appimage/AppImageGroups.ts";

export function LauncherPage(launcher: Launcher) {
	const self = Page();

	const header = Gtk.Box.new(Gtk.Orientation.HORIZONTAL, SPACING * 1.5);
	const header_content = Gtk.Box.new(Gtk.Orientation.VERTICAL, 0);
	header_content.set_valign(Gtk.Align.CENTER);
	header.append(header_content);

	const icon = Gtk.Image.new();
	if (launcher.desktop.icon?.startsWith("/")) {
		icon.set_from_file(launcher.desktop.icon);
	} else {
		icon.set_from_icon_name(launcher.desktop.icon);
	}
	icon.set_pixel_size(120);
	header.prepend(icon);

	const title = Gtk.Label.new();
	title.set_halign(Gtk.Align.START);
	title.set_wrap(true);
	title.set_wrap_mode(Pango.WrapMode.WORD_CHAR);
	title.set_markup(html`
		<span size="x-large"><b>${launcher.desktop.name}</b></span>
	`);
	title.set_margin_bottom(SPACING * .25);
	header_content.append(title);

	const subtitle = Gtk.Label.new();
	subtitle.set_halign(Gtk.Align.START);
	subtitle.set_wrap(true);
	subtitle.set_wrap_mode(Pango.WrapMode.WORD_CHAR);
	subtitle.set_opacity(.65);
	subtitle.set_markup(html`
		<small>${launcher.desktop.description ?? formatLauncherTypeName(launcher.info.type)}</small>
	`);
	header_content.append(subtitle);

	const launchButton = Gtk.Button.new();
	launchButton.set_label("Launch");
	launchButton.set_css_classes(buttonClass("suggested-action"));
	launchButton.set_halign(Gtk.Align.START);
	launchButton.connect("clicked", () => {
		const cmd = new Deno.Command("bash", {
			args: ["-c", `nohup ${launcher.desktop.exec} >/dev/null 2>&1 &`],
		});
		cmd.spawn().unref();
	});
	launchButton.set_margin_top(SPACING);
	header_content.append(launchButton);

	const content = Gtk.Box.new(Gtk.Orientation.VERTICAL, SPACING);

	const { info } = launcher;

	if (info.type === "appimage") {
		const appImageGroups = AppImageGroups(info);
		content.append(appImageGroups);
	}

	self.container.append(header);
	self.container.append(content);

	return self;
}
