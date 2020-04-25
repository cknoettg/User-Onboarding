import React, { useState } from "react";
import * as Yup from "yup";

const Form = props => {
  // console.log("this is our props",props);

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
      })
      .catch(err => console.log(err.response));
  };

  //this is our state
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    password: "",
    terms: ""
  });

  // State for the error messages
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    terms: ""
  });

  //Yum validation
  const formSchema = Yup.object().shape({
    email: Yup
      .string()
      .email("Must be a valid email address.")
      .required("Must include email address."),
    password: Yup
      .string()
      .min(6, "Passwords must be at least 6 characters long.")
      .required("Password is Required"),
    terms: Yup
      .boolean()
      .oneOf([true], "You must accept Terms and Conditions")
      // required isn't required for checkboxes.
  });

  //useState
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
    yup
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
  
}};

export default Form;