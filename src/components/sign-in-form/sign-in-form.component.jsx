import React, { useState } from "react";
import {
    createUserDocFromAuth,
    signInWithGooglePopup,
    userSignInWithEmailAndPassword,
} from "../../utils/firebase/firebase.utils.js";
import Button, { BUTTON_TYPE_CLASSES } from "../button/button.component";
import FormInput from "../form-input/form-input.component";
import "./sign-in-form.styles.jsx";
import {
    SignInButtonContainer,
    SignInContainer,
} from "./sign-in-form.styles.jsx";

const defaultFormFields = {
    email: "",
    password: "",
};

const SingInForm = () => {
    const logGoogleUser = async () => {
        const response = await signInWithGooglePopup();
        await createUserDocFromAuth(response.user);
    };

    const [formFields, setFormFields] = useState(defaultFormFields);

    //Note: Do not destructure from default Form Fields, get data from the state
    const { email, password } = formFields;

    //Reset form once submitted and user auth is successfull
    const resetFormFields = () => {
        setFormFields(defaultFormFields);
    };

    //State handling - updating the state as the user types in the value
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormFields({ ...formFields, [name]: value });
    };

    //Form Submit handling
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await userSignInWithEmailAndPassword(email, password);
            resetFormFields();
        } catch (error) {
            switch (error.code) {
                case "auth/user-not-found":
                    alert("User not found !!!");
                    break;
                case "auth/wrong-password":
                    alert("Incorrect password !!!");
                    break;
                default:
                    console.log("Error: " + error.message);
            }
        }
    };

    return (
        <SignInContainer>
            <h2>Already have an account ?</h2>
            <span>Sign in with your email and password</span>
            <form
                onSubmit={(event) => {
                    handleSubmit(event);
                }}
            >
                <FormInput
                    label="Email: "
                    type="email"
                    required
                    onChange={handleChange}
                    name="email"
                    value={email}
                />

                <FormInput
                    label="Password: "
                    type="password"
                    required
                    onChange={handleChange}
                    name="password"
                    value={password}
                    minLength="6"
                />

                <SignInButtonContainer>
                    <Button type="submit">Sign In</Button>
                    {/* Here type='button' is used to prevent form submission on google popup click */}
                    <Button
                        type="button"
                        buttonType={BUTTON_TYPE_CLASSES.google}
                        onClick={logGoogleUser}
                    >
                        Sign In with Google
                    </Button>
                </SignInButtonContainer>
            </form>
        </SignInContainer>
    );
};

export default SingInForm;
