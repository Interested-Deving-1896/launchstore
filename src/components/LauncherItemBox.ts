import { formatLauncherTypeName, Launcher } from "~/src/libs/launchers.ts";
import { TitlesAndIconBox } from "~/src/components/TitlesAndIconBox.ts";

export function LauncherItemBox(launcher: Launcher) {
	return TitlesAndIconBox({
		title: launcher.desktop.name,
		subtitle: launcher.desktop.description ?? formatLauncherTypeName(launcher.info.type),
		icon: launcher.desktop.icon,
	});
}
