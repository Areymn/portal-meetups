// Guarda herramientas o funciones que se pueden reutilizar en todo el proyecto (ejm: funciones para enviar emails)

export const formatDate = (date) => {
  return new Date(date).toISOString().split("T")[0];
};
