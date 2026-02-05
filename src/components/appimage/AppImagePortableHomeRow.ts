import Adw from "@girs/Adw";
import Gtk from "@girs/Gtk";
import { SPACING } from "~/constants.ts";
import { Launcher } from "~/libs/launchers.ts";
import { html } from "~/libs/utils/markup.ts";
import { buttonClass } from "~/libs/utils/buttonClass.ts";
import { bind } from "~/libs/utils/bind.ts";
import { formatBytes } from "~/libs/utils/format.ts";
import { removeChildren } from "~/libs/utils/gtk.ts";

export function AppImagePortableHomeRow(info: Launcher.AppImageInfo) {
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
		<b>Portable Home</b>
	`);
	infoBox.append(label);

	const sizeText = Gtk.Label.new();
	sizeText.set_halign(Gtk.Align.START);
	bind(sizeText, () =>
		info.portable.size.follow((size) => {
			sizeText.set_markup(html`
				<small>${formatBytes(size)}</small>
			`);
		}, true));
	sizeText.set_opacity(.65);
	infoBox.append(sizeText);

	const actionBox = Gtk.Box.new(Gtk.Orientation.HORIZONTAL, SPACING * .25);
	rowContent.append(actionBox);
	bind(actionBox, (box) =>
		info.portable.exist.follow((portable) => {
			removeChildren(box);

			if (portable) {
				const clearButton = Gtk.Button.new();
				clearButton.set_css_classes(buttonClass("destructive-action flat"));
				clearButton.set_label("Clear");
				clearButton.set_halign(Gtk.Align.START);
				clearButton.connect("clicked", () => {
					info.portable.clear();
				});
				box.append(clearButton);

				const deleteButton = Gtk.Button.new();
				deleteButton.set_label("Delete");
				deleteButton.set_css_classes(buttonClass("destructive-action"));
				deleteButton.set_halign(Gtk.Align.START);
				deleteButton.connect("clicked", () => {
					info.portable.delete();
				});
				box.append(deleteButton);
			} else {
				const createButton = Gtk.Button.new();
				createButton.set_css_classes(buttonClass("suggested-action"));
				createButton.set_label("Create");
				createButton.set_halign(Gtk.Align.START);
				createButton.connect("clicked", () => {
					info.portable.create();
				});
				box.append(createButton);
			}
		}, true));

	return row;
}
