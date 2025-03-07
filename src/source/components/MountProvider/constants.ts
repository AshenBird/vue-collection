
import type { MountApiInjection } from "./types";
import { createInjectionKey } from "./utils";


export const MountInjectionKey = createInjectionKey<MountApiInjection>("MountInjectionKey")
