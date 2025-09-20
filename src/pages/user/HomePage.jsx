import { Link } from "react-router-dom";
import ContactCard from "../../components/user/contact/ContactCard";

function Home() {
  return (
    <ContactCard
      facebookUrl="https://www.facebook.com/yourprofile"
      zaloUrl="https://zalo.me/yourzalo"
      phoneNumber="123-456-7890"
      fbGroupUrl="https://www.facebook.com/groups/yourgroup"
    ></ContactCard>
  );
}

export default Home;
