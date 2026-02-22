import { Link } from "react-router-dom";

function PageNotFound() {
  return (
    <div className="not-found">
      <h1>404</h1>
      <p>Page not found.</p>
      <Link to="/">Go home</Link>
    </div>
  );
}

export default PageNotFound;
