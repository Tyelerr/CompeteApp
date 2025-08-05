export enum EInputValidation{
  Required = 'required',
  Email = 'email',
  Username = 'username',
  Password = 'password',
  GreatThenZero = 'great-then-zero'
}



export interface IPickerOption {
  label: string;
  value: string | number | null;
  key?: string | number; // Optional key for FlatList/Picker
  color?: string; // Optional color for the item text
  inputLabel?: string; // Optional label to display in the input field
}