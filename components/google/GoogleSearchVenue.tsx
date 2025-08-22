import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import LFInput from '../LoginForms/LFInput';
import { StyleGoogle } from '../../assets/css/styles';
import { BasePaddingsMargins } from '../../hooks/Template';

// const GOOGLE_PLACES_API_KEY = 'AIzaSyCseIiXh45pemRngXvFPvlTbru_KjXS_P4'; // Replace with your key
const GOOGLE_PLACES_API_KEY = 'AIzaSyC8ih2uZXpyubGDgVGJ1D32NLRS9LSs0gw';

const DirectPlaceSearch = ({
  setAddressOut,
  searchTextOut,
  setVenueOut,
  setLatOut,
  setLngOut,
  placeholder,
  marginBottom
}:
{
  setVenueOut?:(venue:string)=>void,
  searchTextOut?: string,
  setAddressOut?:(address:string)=>void,
  setLatOut?:(address:string)=>void,
  setLngOut?:(address:string)=>void,
  placeholder?:string,
  marginBottom?:number
}) => {
  
  const [searchText, setSearchText] = useState('');
  const [predictions, setPredictions] = useState([]);
  const [selectedPlaceDetails, setSelectedPlaceDetails] = useState(null);
  const debounceTimeout = React.useRef(null);
  const [placeName, setPlaceName] = useState<string>('');
  const [placeAddress, setPlaceAddress] = useState<string>('');

  /*useEffect(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    if (searchText.length > 2) { // Only search if more than 2 characters
      debounceTimeout.current = setTimeout(() => {
        fetchPlacePredictions(searchText);
      }, 500); // Debounce for 500ms
    } else {
      setPredictions([]);
    }

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [searchText]);*/

  const fetchPlacePredictions = async (input:string) => {
    try {
      const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&key=${GOOGLE_PLACES_API_KEY}&types=establishment&language=en`;
      const response = await fetch(url);
      const json = await response.json();
      // // // // // // // // // // // console.log('json.predictions:', json.predictions);
      if (json.predictions) {
        setPredictions(json.predictions);
      }
    } catch (error) {
      console.error('Error fetching place predictions:', error);
    }
  };

  const fetchPlaceDetails = async (placeId:string) => {
    try {
      const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${GOOGLE_PLACES_API_KEY}&fields=name,geometry,formatted_address,photos,opening_hours,website,vicinity,rating,price_level,url`;
      const response = await fetch(url);
      const json = await response.json();
      if (json.result) {

        // // // // // // // console.log('json google:', json);
        // // // // // // // console.log('json google geometry location:', json.result.geometry.location);
        if(setLatOut){
          setLatOut( json.result.geometry.location.lat );
        }
        if(setLngOut){
          setLngOut( json.result.geometry.location.lng );
        }

        setSelectedPlaceDetails(json.result);
        // alert(`Selected: ${json.result.name}\nAddress: ${json.result.formatted_address}`);
        setSearchText(json.result.name);
        // // // // // // // // // // // console.log('Place Details:', json.result);
        setPlaceName(json.result.name);
        setPlaceAddress(json.result.formatted_address);
        if(setVenueOut!==undefined){
          setVenueOut(json.result.name);
        }
        if(setAddressOut!==undefined){
          setAddressOut(json.result.formatted_address)
        }
      }
    } catch (error) {
      console.error('Error fetching place details:', error);
    }
  };

  return (
    <View style={[
      // styles.container
      StyleGoogle.searchVenue_Container,
      {
        marginBottom: marginBottom!==undefined?marginBottom:StyleGoogle.searchVenue_Container.marginBottom
      }
    ]}>
      {/*<TextInput
        style={[
          // styles.textInput
        ]}
        placeholder="Search for a venue..."
        value={searchText}
        onChangeText={setSearchText}
      />*/}
      <LFInput
        placeholder={placeholder!==undefined?placeholder:"Search for a venue..."}
        value={searchTextOut!==undefined?searchTextOut:searchText}
        iconFront='location'
        onChangeText={(text:string)=>{
          setSearchText(text);
          fetchPlacePredictions(text);


          if(searchTextOut!==undefined && setVenueOut!==undefined){
            // add searchTextOut only in case if you like to change the text of this input from out
            setVenueOut(text);
          }
        }}
        marginBottomInit={0}
      />
      {predictions.length > 0 && (
        /**/
        /*<FlatList
          data={predictions}
          keyExtractor={(item) => item.place_id}
          nestedScrollEnabled={true}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{}}
              onPress={() => {
                // // // // // // // // // // console.log('item:', item);
                // setSearchText(item.description);
                setPredictions([]); // Clear predictions
                fetchPlaceDetails(item.place_id); // Fetch details for selected
              }}
            >
              <Text style={{
                color: 'white'
              }}>{item.description}</Text>
            </TouchableOpacity>
          )}
          style={{
            height: 100
          }}
        />*/
        
          <ScrollView 
            nestedScrollEnabled={true}
          style={[
          {
            maxHeight: 200,
            paddingTop: BasePaddingsMargins.m10
          },
          StyleGoogle.searchVenue_ScrollView
        ]}>
          {
            predictions.map((item, key)=>{
              return <TouchableOpacity
                  key={`google-map-touchable-item-${key}`}
                  style={[
                    // styles.predictionItem
                    StyleGoogle.searchVenue_ItemContainer
                  ]}
                  onPress={() => {
                    // // // // // // // // // // console.log('item:', item);
                    // setSearchText(item.description);
                    // // // // // // // console.log('item:', item);
                    // // // // // // console.log('item searched:', item);
                    setPredictions([]); // Clear predictions
                    fetchPlaceDetails(item.place_id); // Fetch details for selected
                  }}
                >
                  <Text style={[
                    // styles.predictionText
                    StyleGoogle.searchVenue_ItemText
                  ]}>{item.description}</Text>
                </TouchableOpacity>
            })
          }
        </ScrollView>
        
      )}
      {/*selectedPlaceDetails && (
        <View style={styles.detailsContainer}>
          <Text style={styles.detailsTitle}>{selectedPlaceDetails.name}</Text>
          <Text>{selectedPlaceDetails.formatted_address}</Text>
          {selectedPlaceDetails.rating && <Text>Rating: {selectedPlaceDetails.rating}</Text>}
        </View>
      )*/}
    </View>
  );
};

/*const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  textInput: {
    width: '90%',
    height: 44,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 10,
  },
  predictionList: {
    width: '90%',
    maxHeight: 200, // Limit height of the suggestion list
    backgroundColor: 'white',
    borderRadius: 5,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 1,
  },
  predictionItem: {
    padding: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
  },
  predictionText: {
    fontSize: 16,
  },
  detailsContainer: {
    marginTop: 20,
    padding: 20,
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 5,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
});*/

export default DirectPlaceSearch;