import Adw from "@girs/Adw";
import Gtk from "@girs/Gtk";
import { SPACING } from "~/constants.ts";
import { Launcher } from "~/libs/launchers.ts";
import { html } from "~/libs/utils/markup.ts";
import { bind } from "~/libs/utils/bind.ts";
import { formatBytes } from "~/libs/utils/format.ts";

export function AppImageSizeRow(info: Launcher.AppImageInfo) {
	const row = Adw.ActionRow.new();
	row.set_activatable(false);
	const rowContent = Gtk.Box.new(Gtk.Orientation.HORIZONTAL, SPACING);
	rowContent.set_margin_top(SPACING);
	rowContent.set_margin_bottom(SPACING);
	rowContent.set_margin_start(SPACING);
	rowContent.set_margin_end(SPACING);
	row.set_child(rowContent);

	const infoBox = Gtk.Box.new(Gtk.Orientation.VERTICAL, 0);
	infoBox.set_hexpand(true);
	rowContent.append(infoBox);

	const label = Gtk.Label.new();
	label.set_halign(Gtk.Align.START);
	label.set_markup(html`
		<b>AppImage</b>
	`);
	infoBox.append(label);

	const sizeText = Gtk.Label.new();
	sizeText.set_halign(Gtk.Align.START);
	bind(sizeText, () =>
		info.appimage.size.follow((size) => {
			sizeText.set_markup(html`
				<small>${formatBytes(size)}</small>
			`);
		}, true));
	sizeText.set_opacity(.65);
	infoBox.append(sizeText);

	return row;
}
