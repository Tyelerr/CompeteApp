import { Alert } from "react-native";
/*import { 
  ICAUserData, 
  EUserStatus, 
  // useContextAuth 
} from "../context/ContextAuth";*/

import { ICrudUserData } from "./CrudUserInterface"
import { supabase } from "./supabase"
import { ICAUserData, EUserStatus, EUserRole } from "../hooks/InterfacesGlobal";



export const FetchProfileData = async (userId:string)=>{
  try{
    const { data, error } = await supabase
      .from('profiles')
      .select("*")
      .eq('id', userId)
      .single();
    if(error){

    }
    if(data){
      return {
        user: data as ICAUserData
        , error: null};
    }
    else{
      return {user:null, error};
    }
  }
  catch(error){
    return {user:null, error}
  }
}

export const FetchUsers = async (
  loggedUser:ICAUserData,
  s?:string,
  userRole?: EUserRole,
  searchIdNumber?: string
)=>{

  // const {user} = useContextAuth();
  const search:string = s===undefined?'':s;
  const userRoleQuery:string = userRole===undefined?'':userRole;

  try{
    let query = supabase
      .from('profiles')
      .select("*"); // starting with base query;
    query
      .not('id', 'eq', loggedUser.id)
      // .not('role', 'eq', 'AAA')
      .not('status', 'eq', EUserStatus.StatusDeleted);
    if(search!==''){
      query
        .or(`user_name.ilike.%${search}%,name.ilike.%${search}%,email.ilike.%${search}%`);
    }
    if(searchIdNumber!==''){
      // console.log(`Searching users by searchIdNumber: ${searchIdNumber}`);
      // query.or(`id_auto33::text.ilike.%${searchIdNumber}%`);
    }
    if(userRoleQuery!==''){
      query
        .eq('role', userRoleQuery);
    }
    query
      .limit(10)
      .order('created_at', {ascending:false});
    const { data, error } = await query;
    // // // // // console.log('error:', error);
    return { data, error }
  } 
  catch(error){
    return { users:[], error };
  }
}
export const FetchUsersV2 = async (
  loggedUser:ICAUserData,
  s?:string,
  userRole?: EUserRole,
  searchIdNumber?: string
)=>{

  // const {user} = useContextAuth();
  const search:string = s===undefined?'':s;
  const userRoleQuery:string = userRole===undefined?'':userRole;

  const argumentsFor = {
    search:search!==''?search:null,
    user_role:userRoleQuery!==''?userRoleQuery:null,
    search_id_number:searchIdNumber!=='' && !isNaN(Number(searchIdNumber))?searchIdNumber:null

  };

  try{
    const {
      data: dataIds, error: errorIds
    } = await supabase
      .rpc('get_users_for_administrator', argumentsFor);


      const usersIds:string[] = [];
      if(dataIds!==null)
        for(let i=0;i<dataIds.length;i++){
          usersIds.push(dataIds[i].id);
        }

      const { data, error } = await supabase
      .from('profiles')
      .select(`*`)
      .in('id', usersIds)
      // here order should be set too
      // .limit(10)
      .order('created_at', {ascending: false})
      ;

    return { data, error };

  } 
  catch(error){
    return {users: [], error};
  }

}


export const SignUp = async (newUser:ICrudUserData)=>{
  try{
    
    // check if the username exist 
    const { data: DataIfExist, error: ErrorCheckingDataIfExist } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_name', newUser.username)
      .limit(1);
    // if()
    // console.log('DataIfExist from crud:', DataIfExist);
    if(DataIfExist && DataIfExist.length!==0){
      return { data: DataIfExist, error: 'username-exist' };
    }


    const { data, error } = await supabase.auth.signUp({
      email: newUser.email,
      password: newUser.password
    });

    if(error){
      throw error;
    }

    if(data.user){
      const {error: profileError} = await supabase
        .from('profiles')
        .upsert({
          id: data.user.id,
          // user_name: data.userName
          email: data.user.email,
          user_name: newUser.username
        })
      if(profileError){
        throw profileError;
      }

      const {user, error} = await FetchProfileData(data.user.id);

      return {user, data, error:null};
    }
    return {user: null, error:null};
  }
  catch(error){
    return { data: null, error };
  }
}

export const SignIn = async (userSignIn: ICrudUserData)=>{

  const email = userSignIn.email;
  const username = userSignIn.username;
  const password = userSignIn.password;

  let emailTemporary:string = email;

  /*// // // console.log('Start selecting');
  const { data, error } = await supabase
      .from('profiles')
      .select('*');
  // // // console.log('End selecting');
  return;*/

      


  try{

    // // // console.log('trying to login 3');

    const { data: userByUsername, error: ErrorUserByUserName } = await supabase
      .from('profiles')
      .select("*")
      .eq('user_name', username)
      .neq('status', EUserStatus.StatusDeleted)
      .single();
    // console.log('userByUsername:', userByUsername);
    if(userByUsername){
      // this mean that the user exist
      const userByUserNameI: ICAUserData = userByUsername as ICAUserData;
      emailTemporary = userByUserNameI.email;
    }
    /*else{
      Already i am checking if the user is deleted so no need for this:
      // now check if the email exist but is deleted
      const { data: userByEmailAddressButDeleted, error: ErrorUserByEmailAddressButDeleted } = await supabase
        .from('profiles')
        .select("*")
        .eq('email', emailTemporary)
        .eq('status', EUserStatus.StatusDeleted)
        .single();
      if(userByEmailAddressButDeleted){

      }
    }*/

    const { data, error } = await supabase.auth.signInWithPassword({
      email: emailTemporary,
      password
    });

    // // // console.log('login error after :', error);

    if(error)throw error;

    const { user } = await FetchProfileData(data.user.id);
    // const user:ICAUserData = data[]
    if(user.status===EUserStatus.StatusDeleted){
      return { error: EUserStatus.StatusDeleted }
    }

    return {user, data: data.user, error: null}
  } 
  catch(error){
    return { data:null, error };
  }
}


export const GetSession = async ()=>{
  try{
    const { data: { session }, error } = await supabase.auth.getSession();
    // // // // // // // console.log('session:', session)
    // // // // // // // console.log('error:', error)
    if(error){
      throw error;
    }
    else if(session){
      const userProfileData = await FetchProfileData(session.user.id);
      return { user: userProfileData.user, error: null, case_: '1' }
    }
    else{
      return { user: null, error: null, case_:'3' }
    }
  } 
  catch(error){
    return { user:null, error, case_:'4' };
  }
  /*finally{
    return { user: null, error: null, case_:'5' }
  }*/
}

export const UpdateProfile = async (userId:string, dataForUpdate)=>{
  try{
    const { data, error } = await supabase
      .from('profiles')
      .update(dataForUpdate)
      .eq('id', userId) // Filter by user ID
      .select(); // Select the updated data (optional, but good for verification)
    // // // // // // console.log('error after update profile:', error);
    if(error){
      return false;
    }
    if(data && data.length>0){
      return true;
    }
  } 
  catch(error){
    // // // // // // console.log('error after update profile:', error);
  }
}

export const DeleteUser = async (userForDeleting: ICAUserData)=>{
  // Alert.alert('12');
  try{
    const { data, error } = await supabase.auth.admin.deleteUser(
      userForDeleting.id
    ); 
    // // // // // console.log('error after deleting user: ', error);

    // const {data, error} = supabase.from
    UpdateProfile( userForDeleting.id, {
      status: EUserStatus.StatusDeleted
    } );
  } 
  catch(error){
    // // // // // console.log('crach error after deleting user:', error);
  }
}