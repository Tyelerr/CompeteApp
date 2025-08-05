import { EInputValidation } from "../components/LoginForms/Interface";

export const EmailIsValid = (email:string)=>{
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
export const UsernameIsValid = (username:string)=> {
    // Rule 1: Check for null, undefined, or empty string
    if (typeof username !== 'string' || username.trim() === '') {
        return { valid: false, message: "Username cannot be empty." };
    }

    const trimmedUsername = username.trim();

    // Rule 2: Length requirements
    const minLength = 3;
    const maxLength = 20;
    if (trimmedUsername.length < minLength || trimmedUsername.length > maxLength) {
        return { valid: false, message: `Username must be between ${minLength} and ${maxLength} characters long.` };
    }

    // Rule 3: Allowed characters (alphanumeric, underscore, hyphen, period)
    // Regex: ^[a-zA-Z0-9._-]+$
    //   ^         Start of the string
    //   [a-zA-Z0-9._-]+  One or more occurrences of:
    //                   a-z, A-Z (letters)
    //                   0-9 (numbers)
    //                   . (period)
    //                   _ (underscore)
    //                   - (hyphen)
    //   $         End of the string
    const allowedCharsRegex = /^[a-zA-Z0-9._-]+$/;
    if (!allowedCharsRegex.test(trimmedUsername)) {
        return { valid: false, message: "Username can only contain letters, numbers, underscores, hyphens, and periods." };
    }

    // Rule 4: Must start with a letter or number
    const startsWithAlphanumericRegex = /^[a-zA-Z0-9]/;
    if (!startsWithAlphanumericRegex.test(trimmedUsername)) {
        return { valid: false, message: "Username must start with a letter or number." };
    }

    // Rule 5: Cannot end with a special character (e.g., _, -, .)
    const endsWithSpecialCharRegex = /[._-]$/;
    if (endsWithSpecialCharRegex.test(trimmedUsername)) {
        return { valid: false, message: "Username cannot end with an underscore, hyphen, or period." };
    }

    // Rule 6: No consecutive special characters (e.g., __, --, ..)
    const consecutiveSpecialCharsRegex = /[._-]{2,}/;
    if (consecutiveSpecialCharsRegex.test(trimmedUsername)) {
        return { valid: false, message: "Username cannot contain consecutive special characters (e.g., '__', '--', '..')." };
    }

    // Rule 7: Prevent common reserved words (case-insensitive)
    const reservedWords = [
        "admin", "administrator", "root", "guest", "support",
        "moderator", "webmaster", "abuse", "null", "undefined",
        "anonymous", "test", "user"
    ];
    if (reservedWords.includes(trimmedUsername.toLowerCase())) {
        return { valid: false, message: `"${trimmedUsername}" is a reserved username.` };
    }

    // If all checks pass
    return { valid: true, message: "Username is valid." };
}


export const PasswordIsValid_HaveSpecialCharacter = (password:string):boolean=>{
  const specialCharRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
  return specialCharRegex.test(password);
}
export const PasswordIsVlid_HaveNLetters = (password:string):boolean=>{
  return password.length>=6;
}
export const PasswordIsValid = (password:string):boolean=>{
  return (
    1 === 1
    && PasswordIsValid_HaveSpecialCharacter(password)
    && PasswordIsVlid_HaveNLetters(password)
  );
}
export const PasswordIsValid_ErrorMessage = (password:string):string=>{
  if (!PasswordIsValid_HaveSpecialCharacter(password)) {
    return 'Password must contain at least one special character.';
  }
  if(!(PasswordIsVlid_HaveNLetters(password))){
    return 'Password must be at least 6 characters long.';
  }
  return '';
}
export const NumberIsGreatThenZero = (t:string)=>{
  const _number:number = Number(t);
  return (!isNaN(_number) && _number>0);
}
export const NumberIsGreatThenZero_ErrorMessage = ()=>{
  return 'The value must be greater than 0.';
}

export interface IFormInputValidation{
  value:string,
  validations:EInputValidation[]
}

export const TheFormIsValid = (
  array:IFormInputValidation[]

):boolean=>{

  let ItIsTrue:boolean = true;
  // return true;

  for(let i=0;i<array.length;i++){
    for(let j=0;j<array[i].validations.length;j++){
      if(array[i].validations[j]===EInputValidation.Required && (array[i].value as string)===''){
        // return false;
        ItIsTrue = false;
      }
      if(array[i].validations[j]===EInputValidation.Email && !EmailIsValid(array[i].value)){
        // return false;
        ItIsTrue = false;
      }
      if(array[i].validations[j]===EInputValidation.Username && !UsernameIsValid(array[i].value).valid){
        // return false;
        ItIsTrue = false;
      }
      if(array[i].validations[j]===EInputValidation.Password && !PasswordIsValid(array[i].value)){
        // return false;
        ItIsTrue = false;
      }
      if(array[i].validations[j]===EInputValidation.GreatThenZero && !NumberIsGreatThenZero(array[i].value)){
        // return false;
        ItIsTrue = false;
      }
    }
  }
  return ItIsTrue;
}