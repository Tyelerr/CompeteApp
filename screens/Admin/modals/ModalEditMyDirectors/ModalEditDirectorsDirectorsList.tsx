import { Text, View } from "react-native";
import UIPanel from "../../../../components/UI/UIPanel";
import { StyleZ } from "../../../../assets/css/styles";
import { BaseColors, BasePaddingsMargins } from "../../../../hooks/Template";
import LFButton from "../../../../components/LoginForms/Button/LFButton";
import { useContextAuth } from "../../../../context/ContextAuth";
import { useEffect, useState } from "react";
import { ICAUserData } from "../../../../hooks/InterfacesGlobal";
import { AddDirectorToMyVenues, FetchMyDirectors, FetchPotentialDirectors, RemoveDirector } from "../../../../ApiSupabase/CrudUser";
import LFInput from "../../../../components/LoginForms/LFInput";
import ModalInfoMessage from "../../../../components/UI/UIModal/ModalInfoMessage";

export default function ModalEditDirectorsDirectorsList(


  {
    type,
    AfterChangeTheDirectors
  }
  :
  {
    type: 'add-director' | 'remove-director',
    AfterChangeTheDirectors: ()=>void
  }


){


  
  const {
    user
  } = useContextAuth();

  const [showQuestionMessage, set_showQuestionMessage] = useState<boolean>(false);
  const [directorForRemoving, set_directorForRemoving] = useState<ICAUserData | null>(null)

  const [directors, set_directors] = useState<ICAUserData[]>([]);
  const [ids_adding_director, set_ids_adding_director] = useState<number[]>([]);
  const [ids_removed_directors, set_ids_removed_directors] = useState<number[]>([]);

  const DirectorName = (director: ICAUserData)=>{
    return (

      director.name!=='' && director.name!==null && director.name!==undefined?
                          `${director.name}`
                          :
                          director.email.split('@')[0]

    );
  }
  const DirectorInitials = (director: ICAUserData)=>{
    const _name:string = DirectorName(director);
    return `${_name.split(' ')[0][0]}${_name.split(' ')[1]!==undefined?_name.split(' ')[1][0]:''}`.toUpperCase();
  }

  const [search, set_search] = useState('');


  const ___loadPotentialDirectors = async ()=>{
    if(user===null)return;
    const {
      dataPotentialDirectors,
      dataPotentialDirectorsError
    } = await FetchPotentialDirectors( user.id_auto, search );
    if(dataPotentialDirectors){
      set_directors( dataPotentialDirectors as ICAUserData[] )
    }

    // // console.log('dataPotentialDirectors:', dataPotentialDirectors);
    // // console.log('dataPotentialDirectorsError:', dataPotentialDirectorsError);

  }

  const ___LoadTheDirectors = async ()=>{
    if(user===null)return;

    const {
      data,
      error
    } = await FetchMyDirectors( user.id_auto, search );

    set_directors( data as ICAUserData[] )

  }

  const ___LoadDirectorsGlobal = ()=>{
    
    if(type==='add-director'){
      ___loadPotentialDirectors();
    }
    else if(type==='remove-director'){
      ___LoadTheDirectors();
    }

  }

  useEffect(()=>{
    ___LoadDirectorsGlobal(  );
  }, [  ]);


  const ___AddDirector = async ( userIdThatNeedPermission:number )=>{
    if(user===null)return;
    const {
      data,
      error
    } = await AddDirectorToMyVenues(
      userIdThatNeedPermission,
      user.id_auto
    );
  }

  const ___RemoveDirector = async ( directorId:number ) => {

    if(user===null)return;

    const {
      data, error
    } = await RemoveDirector( user.id_auto, directorId );

    // const newIdsRemoved:number[]= ids_removed_directors.splice(ids_removed_directors.indexOf(directorId), 1);
    ids_removed_directors.push( directorId );
    set_ids_removed_directors( [...ids_removed_directors] );

    // // console.log('data after removing director: ', data);
    // // console.log('error after removing director: ', error);

  }

  useEffect(()=>{
    
    const handler = setTimeout(() => {
      
      // // console.log('Searching...');
      // setDebouncedSearchTerm(searchTerm);
      ___LoadDirectorsGlobal(  );

    }, 500); // 500ms debounce delay

    return ()=>{
      clearTimeout( handler );
    }

  }, [
    search
  ])


  return <>

  <LFInput iconFront="search" label="Search Directors"  placeholder="Enter search text" onChangeText={(text: string)=>{
    set_search( text );
  }} />

  {/*<Text style={[
    StyleZ.p, 
    {
      color: 'yellow'
    }
  ]}>{ids_removed_directors.join(',')}</Text>*/}
    {
                directors.map((director: ICAUserData, key: number)=>{
                  return <UIPanel key={`director-${key}`} style={[
                    (
                      key===directors.length-1?
                      {
                        marginBottom: 0
                      }
                      :
                      {}
                    )
                  ]}>
                    <View style={[
                      {
                        // flexDirection: 'row',
                        // justifyContent: 'space-between'
                      }
                    ]}>
                      <View>

                        <View style={[
                          {
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 50,
                            height: 50,
                            borderRadius: .5*50,
                            backgroundColor: BaseColors.primary,
                            marginInline: 'auto',
                            marginBottom: BasePaddingsMargins.m10
                          }
                        ]}>
                          <Text style={[
                            StyleZ.h3,
                            {
                              margin: 0,
                              marginBlockEnd: 0,
                              marginBottom: 0,
                              padding: 0,
                              marginBlock:0,
                              textAlign: 'center',
                              color: BaseColors.light,
                              
                            }
                          ]}>{DirectorInitials(director)}</Text>
                        </View>

                        <Text style={[
                          StyleZ.h4,
                          {
                            textAlign: 'center'
                          }
                        ]}>{
                          DirectorName(director)
                        }</Text>
                        <Text style={[
                          StyleZ.p,
                          {
                            textAlign: 'center'
                          }
                        ]}>{director.email}</Text>
                        <Text style={[
                          StyleZ.h3,
                          {
                            marginBottom: 0,
                            textAlign: 'center'
                          }
                        ]}>ID: {director.id_auto}</Text>
                      </View>

                      <View style={[
                        {
                          paddingTop: BasePaddingsMargins.m25
                        }
                      ]}>
                        <View>
                          {
                            type==='add-director'
                            ?
                            <>
                              <LFButton 
                              type="primary"
                              label="Add The Director"
                              icon="person-add"
                              size="small"
                              StyleProp={[
                                (ids_adding_director.indexOf(director.id_auto) !== -1?{display: 'none'}:{})
                              ]}
                              onPress={()=>{

                                ___AddDirector( director.id_auto )
                                // ids_adding_director();
                                ids_adding_director.push( director.id_auto );
                                set_ids_adding_director([...ids_adding_director]);

                                AfterChangeTheDirectors()

                              }}
                              />
                              {
                                ids_adding_director.indexOf(director.id_auto) !== -1
                                ?
                                <Text style={[
                                  StyleZ.p,
                                  {
                                    textAlign: 'center'
                                  }
                                ]}>Director Is Added</Text>
                                :
                                null
                              }
                            </>
                            :
                            <>
                            <LFButton 
                              type="danger"
                              label="Remove The Director"
                              icon="person-remove"
                              size="small"
                              StyleProp={[
                                (ids_removed_directors.indexOf(director.id_auto) !== -1?{display: 'none'}:{})
                              ]}
                              onPress={()=>{
                                // ___RemoveDirector( director.id_auto );
                                // AfterChangeTheDirectors()
                                set_showQuestionMessage(true)
                                set_directorForRemoving(director)
                              }}
                              />
                              {
                                ids_removed_directors.indexOf(director.id_auto) !== -1
                                ?
                                <Text style={[
                                  StyleZ.p,
                                  {
                                    textAlign: 'center'
                                  }
                                ]}>Director Is Removed</Text>
                                :
                                null
                              }
                            </>
                          }
                        </View>
                        <View></View>
                      </View>

                    </View>
                  </UIPanel>
                })
              }
  
  <ModalInfoMessage 
    title="Remove Tournament Director" 
    message="Are you sure you want to remove this tournament director from your venue? They will no longer be able to manage tournaments for your location."
    id={10}
    visible={showQuestionMessage}
    buttons={[
      <LFButton type="primary" label="Remove" onPress={()=>{
        set_showQuestionMessage(false);

        if(directorForRemoving!==null){

          ___RemoveDirector( directorForRemoving.id_auto );
          AfterChangeTheDirectors()
        }


      }} />,
      <LFButton type="outline-dark" label="Cancel" onPress={()=>{
        set_showQuestionMessage(false);
      }} />
    ]}
    />

  </>
}