import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { user } from "../services";

const schema = z.object({
  name: z.string(),
  username: z
    .string()
    .min(1, { message: "Username is required" })
    .email({ message: "Invalid email" }),
  password: z
    .string()
    .min(1, { message: "Password is required" })
    .min(5, { message: "Password is too short" }),
});

type FormData = z.infer<typeof schema>;

function RegisterPage() {
  const navigate = useNavigate();

  const {
    setError,
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({ mode: "onChange", resolver: zodResolver(schema) });

  async function onSubmit(data: FormData) {
    console.log("Submitted", data);
    try {
      await user.register(data);
      console.log(data);
      //navigate("/library-items");
    } catch (error: any) {
      console.log(error);
      if (error.response.status === 400) {
        setError("username", { message: error.response.data });
      }
    }
  }

  return (
    <div className="vh-100 d-grid justify-content-center align-content-center">
      <h1 className="mp-4 text-center">Register Page</h1>
      <div className="p-5 shadow rounded-3">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label className="form-label-">Name</label>
            <input
              {...register("name")}
              className="form-control register-input"
            />
          </div>
          <div className="mb-3">
            <label className="form-label-">Username</label>
            <input
              {...register("username")}
              type="email"
              className="form-control login-input"
            />
            {errors.username && (
              <p className="text-danger">{errors.username.message}</p>
            )}
          </div>
          <div className="mb-3">
            <label className="form-label-">Password</label>
            <input
              {...register("password")}
              className="form-control register-input"
            />
            {errors.password && (
              <p className="text-danger">{errors.password.message}</p>
            )}
          </div>
          <div className="d-grid justify-content-center mt-4">
            <button className="btn btn-primary" disabled={!isValid}>
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;

// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// const schema = z.object({
//   name: z.string().min(1, { message: "Name is required." }),
//   username: z
//     .string()
//     .min(1, { message: "Username is required." })
//     .email({ message: "Invalid email format" }),
//   password: z
//     .string()
//     .min(1, { message: "Password is required." })
//     .min(5, { message: "Password is too short" }),
// });

// type FormData = z.infer<typeof schema>;

// function RegisterPage() {
//   const navigate = useNavigate();

//   const {
//     register,
//     handleSubmit,
//     setError,
//     formState: { errors, isValid },
//   } = useForm<FormData>({
//     resolver: zodResolver(schema),
//     mode: "onChange",
//   });

//   const API_BASEURL = "http://localhost:8586/api/auth";
//   const CREDENTIALS = "?username=leila&accessCode=TnYtEb";

//   async function onSubmit(data: FormData) {
//     console.log("Submitted", data);

//     try {
//       // Skicka en POST-förfrågan direkt till API:t
//       const response = await axios.post(
//         `${API_BASEURL}/register${CREDENTIALS}`,
//         data
//       );

//       // Om registreringen är framgångsrik, navigera till inloggningssidan
//       const token = response.data.token;
//       localStorage.setItem("token", token); // Spara token om du behöver det
//       navigate("/login");
//     } catch (error: any) {
//       // Hantera fel som kommer från servern
//       if (error.response && error.response.status === 400) {
//         setError("username", { message: error.response.data });
//       } else {
//         console.error("Registration error:", error);
//       }
//     }
//   }

//   // async function onSubmit(data: FormData) {
//   //   console.log("Submitted", data);
//   //   try {
//   //     const { data: user } = await axios.post(
//   //       "http://localhost:8586/api/users?username=leila&accessCode=TnYtEb",
//   //       data
//   //     );

//   //     const token = user.data.token;
//   //     if (token) {
//   //       localStorage.setItem("token", token);
//   //     }
//   //     navigate("/login");
//   //   } catch (error: any) {
//   //     if (error.response && error.response.status === 400) {
//   //       setError("username", { message: error.response.data });
//   //     } else {
//   //       console.error("Registration error:", error);
//   //     }
//   //   }
//   // }

//   return (
//     <div className="vh-100 d-flex justify-content-center align-items-center">
//       <div className="p-5 shadow rounded-3">
//         <h1 className="mb-4 text-center">Register Page</h1>
//         <form onSubmit={handleSubmit(onSubmit)}>
//           <div className="mb-3">
//             <label className="form-label">Name</label>
//             <input
//               {...register("name")}
//               className="form-control"
//               placeholder="Enter your name"
//             />
//             {errors.name && (
//               <p className="text-danger">{errors.name.message}</p>
//             )}
//           </div>
//           <div className="mb-3">
//             <label className="form-label">Username</label>
//             <input
//               {...register("username")}
//               type="email"
//               className="form-control"
//               placeholder="Enter your email"
//             />
//             {errors.username && (
//               <p className="text-danger">{errors.username.message}</p>
//             )}
//           </div>
//           <div className="mb-3">
//             <label className="form-label">Password</label>
//             <input
//               {...register("password")}
//               type="password"
//               className="form-control"
//               placeholder="Enter your password"
//             />
//             {errors.password && (
//               <p className="text-danger">{errors.password.message}</p>
//             )}
//           </div>
//           <div className="d-grid justify-content-center mt-4">
//             <button
//               className="btn btn-primary"
//               type="submit"
//               disabled={!isValid}
//             >
//               Register
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default RegisterPage;
