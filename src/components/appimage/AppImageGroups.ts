import Gtk from "@girs/Gtk";
import { SPACING } from "~/constants.ts";
import { Launcher } from "~/libs/launchers.ts";
import { AppImageSizeGroup } from "~/components/appimage/AppImageSizeGroup.ts";

export function AppImageGroups(info: Launcher.AppImageInfo) {
	const container = Gtk.Box.new(Gtk.Orientation.VERTICAL, SPACING);

	const sizeGroup = AppImageSizeGroup(info);
	container.append(sizeGroup);

	return container;
}
