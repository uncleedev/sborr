import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div>
      Home
      <Link to={"/auth/signin"}>Signin</Link>
    </div>
  );
}
