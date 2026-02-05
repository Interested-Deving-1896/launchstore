import Adw from "@girs/Adw";
import Gtk from "@girs/Gtk";
import { SPACING } from "~/src/constants.ts";
import { Launcher } from "~/src/libs/launchers.ts";
import { html } from "~/src/libs/utils/markup.ts";
import { buttonClass } from "~/src/libs/utils/buttonClass.ts";
import { bind } from "~/src/libs/utils/bind.ts";
import { formatBytes } from "~/src/libs/utils/format.ts";
import { removeChildren } from "~/src/libs/utils/gtk.ts";
import { computed } from "~/src/libs/signals.ts";

export function AppImageSizeGroup(info: Launcher.Info & { type: "appimage" }) {
	const sizeGroup = Adw.PreferencesGroup.new();
	sizeGroup.set_title("Size");

	const appImageRow = AppImageSizeRow(info);
	sizeGroup.add(appImageRow);

	const portableHomeRow = AppImagePortableHomeRow(info);
	sizeGroup.add(portableHomeRow);

	const totalRow = AppImageTotalSizeRow(info);
	sizeGroup.add(totalRow);

	return sizeGroup;
}

function AppImagePortableHomeRow(info: Launcher.Info & { type: "appimage" }) {
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

function AppImageSizeRow(info: Launcher.Info & { type: "appimage" }) {
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

function AppImageTotalSizeRow(info: Launcher.Info & { type: "appimage" }) {
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
		<b>Total</b>
	`);
	infoBox.append(label);

	const sizeText = Gtk.Label.new();
	sizeText.set_halign(Gtk.Align.START);
	const totalSize = computed(() => info.appimage.size.get() + info.portable.size.get());
	bind(sizeText, () =>
		totalSize.follow((size) => {
			sizeText.set_markup(html`
				<small>${formatBytes(size)}</small>
			`);
		}, true));
	sizeText.set_opacity(.65);
	infoBox.append(sizeText);

	return row;
}
