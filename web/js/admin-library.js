export const SHARED_LIBRARY_PROXY = "/library-api";

export function adminLibraries({ development, apiBase = "/api" }) {
  const main = {
    id: "main",
    title: "Biblioteca principal",
    apiBase: development ? SHARED_LIBRARY_PROXY : apiBase,
    description:
      "Biblioteca compartida con la web publicada. Aquí aparecen los documentos procesados y sus borradores; los cambios se comparten.",
  };
  return development
    ? [
        main,
        {
          id: "local",
          title: "Pruebas locales",
          apiBase,
          description: "Espacio temporal para pruebas. Sus archivos se eliminan después de 7 días.",
        },
      ]
    : [main];
}

export function chooseAdminLibrary(libraries, id) {
  return libraries.find((library) => library.id === id) || libraries[0];
}
