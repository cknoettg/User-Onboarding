import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import axios from "axios";
import "./Form.css";

//Yum validation
const formSchema = Yup.object().shape({
  name: Yup
    .string()
    .required("Name is required."),
  email: Yup
    .string()
    .email("Must be a valid email address.")
    //.matches(/\Bwaffle@syrup\B/, "That email is already taken.")
    .required("Must include email address."),
  password: Yup
    .string()
    .min(6, "Passwords must be at least 6 characters long.")
    .required("Password is Required"),
  terms: Yup
    .boolean()
    .oneOf([true], "You must accept Terms and Conditions"),
    // required isn't required for checkboxes.
  role: Yup
    .string()
    .required("Role is required."),
  bio: Yup
    .string()
    .required("You must enter a Bio."),
  suffix: Yup
  .string(),
  gpa: Yup
    .string()
    .required("GPA is required.")
});

const Form = props => {
  // console.log("this is our props",props);
  
  //this is our state
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    password: "",
    terms: "",
    role: "",
    bio: "",
    suffix: "",
    gpa: ""
  });

  //state for our post request
  const [post, setPost] = useState([]);

  //state for our Button state - initialize to true or false?
  const [buttonDisabled, setButtonDisabled] = useState(true);
  
  //submit button function
  const formSubmit = e => {
    e.preventDefault();
    console.log("submitted");

    //add our POST request
    axios
      .post("https://reqres.in/api/users", formState)
      .then(res => {
        setPost(res.data); // get just the form data from the REST api
        console.log("success", res);

        //setFormState
        setFormState({
        name: "",
        email: "",
        password: "",
        terms: "",
        role: "",
        bio: "",
        suffix: "",
        gpa: ""
        });
      })
      .catch(err => console.log(err.res));
    
  }; //end of formSubmit

  // State for the error messages
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    terms: "",
    role: "",
    bio: "",
    suffix: "",
    gpa: ""
  });

  /* Each time the form value state is updated, check to see if it is valid per our schema. 
  This will allow us to enable/disable the submit button.*/
  
  useEffect(() => {
    /* We pass the entire state into the entire schema, no need to use reach here. 
    We want to make sure it is all valid before we allow a user to submit
    isValid comes from Yup directly */
    formSchema.isValid(formState).then(valid => {
      setButtonDisabled(!valid);
    });
  }, [formState]);

  //function to track changes
  const inputChange = e => {
    /* e.persist allows us to use the synthetic event in an async manner.
    We need to be able to use it after the form validation */
    e.persist();

    // yup.reach will allow us to "reach" into the schema and test only one part.
    // We give reach the schema as the first argument, and the key we want to test as the second.
    Yup
      .reach(formSchema, e.target.name)
      //we can then run validate using the value
      .validate(e.target.value)
      // if the validation is successful, we can clear the error message
      .then(valid => {
        setErrors({
          ...errors,
          [e.target.name]: ""
        });
      })
      /* if the validation is unsuccessful, we can set the error message to the message 
        returned from yup (that we created in our schema) */
      .catch(err => {
        setErrors({
          ...errors,
          [e.target.name]: err.errors[0]
        });
      });

      const newFormData = {
        ...formState,
        [e.target.name]:
          e.target.type === "checkbox" ? e.target.checked : e.target.value
      };
      
      setFormState(newFormData);
    }; //end of inputChange

    return (
      <form onSubmit={formSubmit}>
        <label htmlFor="name" className="name">
          Name<br></br>
          <input id="name" 
          type="text" 
          name="name" 
          value={formState.name}
          onChange={inputChange} />
          {errors.name.length > 0 ? <p className="error">{errors.name}</p> : null}
        </label>
        <label htmlFor="email" className="email">
        Email<br></br>
        <input
          id="email"
          type="text"
          name="email"
          value={formState.email}
          onChange={inputChange}
        />
        {errors.email.length > 0 ? (
          <p className="error">{errors.email}</p>
        ) : null}
        </label>
        <label htmlFor="password">
          Password<br></br>
          <input
          id="password"
          type="text"
          name="password"
          value={formState.password}
          onChange={inputChange}
        />   
        {errors.password.length > 0 ? <p className="error">{errors.password}</p> : null}     
        </label>
        <label htmlFor="terms">
          Do you agree to the terms and conditions?
          <input 
          id="terms"
          type="checkbox"
          name="terms"
          value={formState.terms}
          onChange={inputChange}
          />
        </label>
        <label htmlFor="role">
          Please select a Role<br></br>
          <select id="role" name="role" onChange={inputChange}>
            <option value="Team Leader">Team Leader</option>
            <option value="React I">React I</option>
            <option value="React II">React II</option>
            <option value="Training">Training</option>
          </select>
        </label> 
        <label htmlFor="bio">
          Bio<br></br>
          <textarea 
          name="bio" 
          value={formState.bio}
          onChange={inputChange} />
          {errors.bio.length > 0 ? <p className="error">{errors.bio}</p> : null}
        </label>
        <label htmlFor="suffix">
          Suffix<br></br>
          Jr
          <input 
          type="radio" 
          value="Jr"
          name="suffix"
          />
          Sr
          <input 
          type="radio" 
          value="Sr"
          name="suffix" 
          />
        </label>
        <label htmlFor="gpa">
          GPA<br></br>
          <input id="gpa" 
          type="text" 
          name="gpa" 
          value={formState.gpa}
          onChange={inputChange} />
          {errors.gpa.length > 0 ? <p className="error">{errors.gpa}</p> : null}
        </label>
        <pre>{JSON.stringify(post, null, 2)}</pre>        
        <button disabled={buttonDisabled}>Submit!</button>
      </form>
    ); //end of return
  
}; //end of Form

export default Form;