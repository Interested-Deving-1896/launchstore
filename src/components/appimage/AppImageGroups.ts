import Gtk from "@girs/Gtk";
import { SPACING } from "~/src/constants.ts";
import { Launcher } from "~/src/libs/launchers.ts";
import { AppImageSizeGroup } from "~/src/components/appimage/AppImageSizeGroup.ts";

export function AppImageGroups(info: Launcher.Info & { type: "appimage" }) {
	const container = Gtk.Box.new(Gtk.Orientation.VERTICAL, SPACING);

	const sizeGroup = AppImageSizeGroup(info);
	container.append(sizeGroup);

	return container;
}
