import { ECustomContentType, ICustomContent } from "../hooks/InterfacesGlobal";
import { supabase } from "./supabase";

const dataCustomContentForDatabase = (content: ICustomContent) => {
  return {
    name: content.name,
    label_about_the_person: content.label_about_the_person,
    address: content.address,
    description: content.description,
    list: content.list,
    labels: content.labels,
    phone_number: content.phone_number,
    type: content.type,

    reward_picture:
      content.reward_picture !== null &&
      content.reward_picture !== "" &&
      content.reward_picture !== undefined
        ? content.reward_picture
        : "",
    reward_link:
      content.reward_link !== null &&
      content.reward_link !== "" &&
      content.reward_link !== undefined
        ? content.reward_link
        : "",
    features:
      content.features !== null &&
      content.features !== "" &&
      content.features !== undefined
        ? content.features
        : "",
    giveawy_rules:
      content.giveawy_rules !== null &&
      content.giveawy_rules !== "" &&
      content.giveawy_rules !== undefined
        ? content.giveawy_rules
        : "",
    subtitle:
      content.subtitle !== null && content.subtitle !== ""
        ? content.subtitle
        : "",
    date_ends:
      content.date_ends !== null &&
      content.date_ends !== "" &&
      content.date_ends !== undefined
        ? content.date_ends
        : "",
    value: !isNaN(Number(content.value)) ? Number(content.value) : 0,

    // ✅ ensure number
    entries: !isNaN(Number(content.entries)) ? Number(content.entries) : 0,

    // ✅ NEW: tournament/giveaway format (null when not set)
    format: content.format ?? null,
  };
};

export const InsertContent = async (content: ICustomContent) => {
  const dataFor = dataCustomContentForDatabase(content);

  try {
    const { data, error } = await supabase
      .from("custom_content")
      .insert(dataFor);
    // .select(); // enable if you want the inserted row back
    return { data, error };
  } catch (error) {
    return { data: null, error };
  }
};

export const UpdateContent = async (
  content: ICustomContent,
  content_id: number
) => {
  const contentForUpdating = dataCustomContentForDatabase(content);

  try {
    const { data, error } = await supabase
      .from("custom_content")
      .update(contentForUpdating)
      .eq("id", content_id)
      .select();

    return { data, error };
  } catch (error) {
    return { data: null, error };
  }
};

export const GetTheLatestContent = async (type: ECustomContentType) => {
  try {
    const { data, error } = await supabase
      .from("custom_content")
      .select("*")
      .eq("type", type)
      .order("id", { ascending: false })
      .limit(1);
    return { data, error };
  } catch (error) {
    return { data: null, error };
  }
};

export const GetContentItems = async (type: ECustomContentType) => {
  const { data, error } = await supabase
    .from("custom_content")
    .select("*")
    .eq("type", type)
    .order("id", { ascending: false })
    .limit(10);
  return { data, error };
};

export const GetTheGifts = async (user_id: number) => {
  const { data, error } = await supabase.rpc("fetchthegiftsv4", {
    mine_id: user_id,
  });

  return { data, error };
};

export const DeleteContent = async (contentId: number) => {
  const { error, data } = await supabase
    .from("custom_content")
    .delete()
    .eq("id", contentId);
  return {
    isDeleted: true,
    error,
    data,
  };
};
