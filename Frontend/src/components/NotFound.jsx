import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="common-page">
      <div className="not-found">
        <h1>404 - Página no encontrada</h1>
        <p>La página que estás buscando no existe.</p>
        <Link to="/" className="back-home">
          Volver al inicio
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
