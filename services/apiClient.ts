import { setupApiClient } from "./api";

// Esse client é utilizado apenas client-side, pois context não é definido
export const api = setupApiClient();