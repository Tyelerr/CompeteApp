import { Alert } from "react-native";
/*import { 
  ICAUserData, 
  EUserStatus, 
  // useContextAuth 
} from "../context/ContextAuth";*/

import { ICrudUserData } from "./CrudUserInterface"
import { supabase } from "./supabase"
import { ICAUserData, EUserStatus, EUserRole, EPermissionType, IPermissions } from "../hooks/InterfacesGlobal";



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
      // // // // console.log(`Searching users by searchIdNumber: ${searchIdNumber}`);
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
    // // // // // // // // console.log('error:', error);
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
    // // // // console.log('DataIfExist from crud:', DataIfExist);
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

  /*// // // // // // console.log('Start selecting');
  const { data, error } = await supabase
      .from('profiles')
      .select('*');
  // // // // // // console.log('End selecting');
  return;*/

      


  try{

    // // // // // // console.log('trying to login 3');

    const { data: userByUsername, error: ErrorUserByUserName } = await supabase
      .from('profiles')
      .select("*")
      .eq('user_name', username)
      .neq('status', EUserStatus.StatusDeleted)
      .single();
    // // // // console.log('userByUsername:', userByUsername);
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

    // // // // // // console.log('login error after :', error);

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
    // // // // // // // // // // console.log('session:', session)
    // // // // // // // // // // console.log('error:', error)
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
    // // // // // // // // // console.log('error after update profile:', error);
    if(error){
      return false;
    }
    if(data && data.length>0){
      return true;
    }
  } 
  catch(error){
    // // // // // // // // // console.log('error after update profile:', error);
  }
}

export const DeleteUser = async (userForDeleting: ICAUserData)=>{
  // Alert.alert('12');
  try{
    const { data, error } = await supabase.auth.admin.deleteUser(
      userForDeleting.id
    ); 
    // // // // // // // // console.log('error after deleting user: ', error);

    // const {data, error} = supabase.from
    UpdateProfile( userForDeleting.id, {
      status: EUserStatus.StatusDeleted
    } );
  } 
  catch(error){
    // // // // // // // // console.log('crach error after deleting user:', error);
  }
}


export const FetchMyDirectors = async ( 
  my_user_id:number,
  filter_search?: string
)=>{

  /*const {
    data, error
  } = await supabase
    .from('permissions')
    .select('*')
    .eq('id_user_give_permission', my_user_id)
    .eq('permission_type', EPermissionType.AccessToBarVenues)
    ;*/

  const {
      data, error
    } = await supabase
      // .rpc('get_analytics_counts', { userid: user.id });
      .rpc( 'fetch_directors_by_filters_v3', 
        { 
          filter_search:filter_search!==undefined?filter_search:'',
          user_id_that_give_permission: my_user_id
        } )
      ;

  let IidsMyDirectors:number[] = [0];
  const PermissionsForDirectors:IPermissions[] = data as IPermissions[];
  for(let i=0;i<PermissionsForDirectors.length;i++){
    IidsMyDirectors.push( PermissionsForDirectors[i].id_user_need_permission );
  }

  const {

    data: dataDirectors,
    error: errorDirectors

  } = await supabase
    .from('profiles')
    .select('*')
    .in('id_auto', IidsMyDirectors);



  return {
    data:dataDirectors, error: errorDirectors
  }
}
export const FetchPotentialDirectors = async (

  my_user_id: number,
  filter_search?: string

)=>{

  const {
    data: _myDirectors_,
    error: myDirectorsError
  } = await FetchMyDirectors( my_user_id );
  const myDirectors: ICAUserData[] = _myDirectors_ as ICAUserData[];
  let myDirectorsIds = [0];
  for(let i=0;i<myDirectors.length;i++){
    myDirectorsIds.push( myDirectors[i].id_auto );
  }

  
  const {
      data: dataFilteredPotentialDirectors, 
      error: errorFilteredPotentialDirectors
    } = await supabase
      // .rpc('get_analytics_counts', { userid: user.id });
      .rpc( 'fetch_potential_directors_v1', 
        { 
          filter_search:filter_search!==undefined?filter_search:'',
          user_id_that_give_permission: my_user_id,
          exclude_user_ids: myDirectorsIds
        } )
      ;
  const IdsForSelecting:number[] = [];
  for(let i=0;i<dataFilteredPotentialDirectors.length;i++){
    IdsForSelecting.push( dataFilteredPotentialDirectors[i].id_auto );
  }

  const {
    data: dataPotentialDirectors,
    error: dataPotentialDirectorsError
  } = await supabase
    .from('profiles')
    .select('*')
    // .neq('id_auto', my_user_id)
    // .not('id_auto', 'in', `(${myDirectorsIds.join(',')})`)
    .in('id_auto', IdsForSelecting)
    .limit(30)
    ;

  return {
    dataPotentialDirectors,
    dataPotentialDirectorsError
  }
}
export const AddDirectorToMyVenues = async (id_user_need_permission:number, id_user_give_permission: number)=>{
  const {data, error} = await supabase
    .from('permissions')
    .upsert({
      id_user_need_permission:id_user_need_permission,
      id_user_give_permission:id_user_give_permission, 
      permission_type: EPermissionType.AccessToBarVenues
    });

    // return {  }
    return {data, error}
}
export const RemoveDirector = async (myId: number, hisId: number)=>{
  const {
    data,
    error
  } = await supabase
    .from('permissions')
    .delete()
    .eq('id_user_need_permission', hisId)
    .eq('id_user_give_permission', myId)
    .eq('permission_type', EPermissionType.AccessToBarVenues);

  return {data, error}
}