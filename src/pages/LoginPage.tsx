import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { auth } from "../services";

const schema = z.object({
  username: z.string().min(1, { message: "Username is required." }),
  password: z.string().min(1, { message: "Password is required." }),
});

type FormData = z.infer<typeof schema>;

function LoginPage() {
  const {
    setError,
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({ resolver: zodResolver(schema) });
  const navigate = useNavigate();
  const { state: fromUrl } = useLocation();
  const user = auth.getCurrentUser();

  async function onSubmit(data: FormData) {
    console.log("Submitted", data);

    try {
      await auth.login(data);
      navigate(fromUrl || "/");
    } catch (error: any) {
      if (error.response.status === 400) {
        setError("username", { message: error.response.data });
      }
    }
  }

  if (user) return <Navigate to={"/library-items"} />;

  return (
    <div className="vh-100 d-grid justify-content-center align-content-center">
      <h1 className="mp-4 text-center">Login Page</h1>
      <div className="p-5 shadow rounded-3">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label className="form-label-">Username</label>
            <input
              {...register("username")}
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
              className="form-control login-input"
            />
            {errors.password && (
              <p className="text-danger">{errors.password.message}</p>
            )}
          </div>
          <div className="d-grid justify-content-center mt-4">
            <button className="btn btn-primary" disabled={!isValid}>
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;

// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useNavigate, Navigate, useLocation } from "react-router-dom";
// import auth from "../services/authService";

// const schema = z.object({
//   username: z.string().min(1, { message: "Username is required." }),
//   password: z.string().min(1, { message: "Password is required." }),
// });

// type FormData = z.infer<typeof schema>;

// function LoginPage() {
//   const navigate = useNavigate();
//   const { state: fromUrl } = useLocation();
//   const user = auth.getCurrentUser();

//   const {
//     register,
//     handleSubmit,
//     setError,
//     formState: { errors, isValid },
//   } = useForm<FormData>({
//     resolver: zodResolver(schema),
//     mode: "onChange",
//   });

//   async function onSubmit(data: FormData) {
//     console.log("Submitted", data);
//     try {
//       const token = await auth.login(data);
//       auth.loginWithJwt(token);
//       navigate(fromUrl || "/library-items");
//     } catch (error: any) {
//       if (error.response && error.response.status === 400) {
//         setError("username", { message: error.response.data });
//       } else {
//         console.error("Login error:", error);
//       }
//     }
//   }

//   if (user) return <Navigate to={"/foods"} />;

//   return (
//     <div className="vh-100 d-flex justify-content-center align-items-center">
//       <div className="p-5 shadow rounded-3">
//         <h1 className="mb-4 text-center">Login Page</h1>
//         <form onSubmit={handleSubmit(onSubmit)}>
//           <div className="mb-3">
//             <label className="form-label">Username</label>
//             <input
//               {...register("username")}
//               className="form-control"
//               placeholder="Enter your username"
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
//               Login
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default LoginPage;

// // import { useForm } from "react-hook-form";
// // import { z } from "zod";
// // import { zodResolver } from "@hookform/resolvers/zod";
// // import { Navigate, useLocation, useNavigate } from "react-router-dom";
// // import { auth } from "../services";

// // const schema = z.object({
// //   username: z.string().min(1, { message: "Username is required." }),
// //   password: z.string().min(1, { message: "Password is required." }),
// // });

// // type FormData = z.infer<typeof schema>;

// // function LoginPage() {
// //   const {
// //     setError,
// //     register,
// //     handleSubmit,
// //     formState: { errors, isValid },
// //   } = useForm<FormData>({ resolver: zodResolver(schema) });
// //   const navigate = useNavigate();
// //   const { state: fromUrl } = useLocation();
// //   const user = auth.getCurrentUser();

// //   async function onSubmit(data: FormData) {
// //     console.log("Submitted", data);

// //     try {
// //       await auth.login(data);
// //       navigate(fromUrl || "/library-items");
// //     } catch (error: any) {
// //       if (error.response.status === 400) {
// //         setError("username", { message: error.response.data });
// //       }
// //     }
// //   }

// //   if (user) return <Navigate to={"/library-items"} />;

// //   return (
// //     <div className="vh-100 d-grid justify-content-center align-content-center">
// //       <h1 className="mp-4 text-center">Login Page</h1>
// //       <div className="p-5 shadow rounded-3">
// //         <form onSubmit={handleSubmit(onSubmit)}>
// //           <div className="mb-3">
// //             <label className="form-label-">Username</label>
// //             <input
// //               {...register("username")}
// //               className="form-control login-input"
// //             />
// //             {errors.username && (
// //               <p className="text-danger">{errors.username.message}</p>
// //             )}
// //           </div>
// //           <div className="mb-3">
// //             <label className="form-label-">Password</label>
// //             <input
// //               {...register("password")}
// //               className="form-control login-input"
// //             />
// //             {errors.password && (
// //               <p className="text-danger">{errors.password.message}</p>
// //             )}
// //           </div>
// //           <div className="d-grid justify-content-center mt-4">
// //             <button className="btn btn-primary" disabled={!isValid}>
// //               Login
// //             </button>
// //           </div>
// //         </form>
// //       </div>
// //     </div>
// //   );
// // }

// // export default LoginPage;
