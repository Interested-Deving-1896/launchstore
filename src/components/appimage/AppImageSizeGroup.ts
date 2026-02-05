import Adw from "@girs/Adw";
import { Launcher } from "~/libs/launchers.ts";
import { AppImageSizeRow } from "~/components/appimage/AppImageSizeRow.ts";
import { AppImagePortableHomeRow } from "~/components/appimage/AppImagePortableHomeRow.ts";
import { AppImageTotalSizeRow } from "~/components/appimage/AppImageTotalSizeRow.ts";

export function AppImageSizeGroup(info: Launcher.AppImageInfo) {
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
