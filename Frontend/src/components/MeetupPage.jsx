// src/components/MeetupPage.jsx
import React, { useState } from "react";
import MeetupForm from "./MeetupForm";
import { useUserContext } from "../context/UserContext";

const MeetupPage = () => {
  const { authenticatedFetch } = useUserContext();
  const [meetups, setMeetups] = useState([]);

  const handleSubmitMeetup = async (meetupData) => {
    try {
      // Realiza la llamada al endpoint de creación de meetups
      const data = await authenticatedFetch(
        "http://localhost:5000/api/meetups/",
        {
          method: "POST",
          body: JSON.stringify(meetupData),
        }
      );
      alert("Meetup creado/modificado correctamente");
      // Actualizar el estado local con el meetup creado
      setMeetups((prevMeetups) => [...prevMeetups, data.event]);
    } catch (err) {
      console.error("Error al crear/modificar meetup:", err);
      alert("Error al crear/modificar el meetup");
    }
  };

  return (
    <div className="common-page">
      <div>
        <h1>Crear/Modificar Meetup</h1>
        <MeetupForm onSubmit={handleSubmitMeetup} />
        {meetups.length > 0 && (
          <div style={{ color: "#000" }}>
            <h2>Meetups creados:</h2>
            {meetups.map((meetup, index) => (
              <div
                key={index}
                style={{
                  border: "1px solid #ccc",
                  margin: "10px",
                  padding: "10px",
                }}
              >
                <h3>{meetup.title}</h3>
                <p>{meetup.description}</p>
                <p>{meetup.date}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MeetupPage;
