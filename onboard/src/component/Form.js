import React, { useState } from "react";
import * as Yup from "yup";

const Form = props => {
  // console.log("this is our props",props);

  const formSubmit = e => {
    e.preventDefault();
    console.log("submitted");
  };

  //this is our state
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    website: "",
    password: ""
  });

  //if needed: function LoginForm() {
    return (
      <form>
        <label htmlFor="name">
          Name
            <input type="email" name="email" placeholder="Email" />
        </label>
        <label htmlFor="email">
            <input type="password" name="password" placeholder="Password" />
        </label>
        <label htmlFor="terms">
          Do you agree to the terms and conditions?
          <input type="checkbox"></input>
        </label>        
        <button>Submit!</button>
      </form>
    );
  
}

export default Form;