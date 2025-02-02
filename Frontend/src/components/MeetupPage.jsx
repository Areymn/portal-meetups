import React from "react";
import MeetupForm from "./MeetupForm";
import { useUserContext } from "../context/UserContext";

const MeetupPage = () => {
  const { authenticatedFetch } = useUserContext();

  const handleSubmitMeetup = async (meetupData) => {
    try {
      // Cambia la URL y método según tu endpoint para crear/modificar meetups
      const response = await authenticatedFetch(
        "http://localhost:5000/api/meetups",
        {
          method: "POST",
          body: JSON.stringify(meetupData),
        }
      );
      alert("Meetup creado/modificado correctamente");
      // Puedes limpiar el formulario o redirigir a otra página
    } catch (err) {
      console.error("Error al crear/modificar meetup:", err);
      alert("Error al crear/modificar el meetup");
    }
  };

  return (
    <div>
      <h1>Crear/Modificar Meetup</h1>
      <MeetupForm onSubmit={handleSubmitMeetup} />
    </div>
  );
};

export default MeetupPage;
