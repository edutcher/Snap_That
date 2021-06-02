export default function useValidaton(state, type) {
  switch (type) {
    case "email":
      const email =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (state === "") return [false, ""];
      else if (!email.test(String(state).toLowerCase()))
        return [true, "Invalid Email"];
      else return [false, ""];
    case "password":
      if (state === "") return [false, ""];
      else if (state.length < 9)
        return [true, "Password must be at least eight characters"];
      else return [false, ""];
    case "username":
      if (state === "") return [false, ""];
      else if (state.includes(" ")) return [true, "No Spaces"];
      else return [false, ""];
    default:
      if (state === "") return [false, ""];
      else if (state.toLowerCase().includes("swear words"))
        return [true, "No Swear Words"];
      else return [false, ""];
  }
}
