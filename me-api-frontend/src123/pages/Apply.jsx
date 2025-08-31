import { useState } from "react";

export default function Apply() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    jobTitle: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Application submitted:", form);
    alert("Application submitted!");
    setForm({ name: "", email: "", jobTitle: "" });
  };

  return (
    <div className="container">
      <h2>Apply for a Job</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={form.name}
          onChange={handleChange}
        /><br /><br />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={form.email}
          onChange={handleChange}
        /><br /><br />
        <input
          type="text"
          name="jobTitle"
          placeholder="Job Title"
          value={form.jobTitle}
          onChange={handleChange}
        /><br /><br />
        <button type="submit" className="btn">Submit</button>
      </form>
    </div>
  );
}
