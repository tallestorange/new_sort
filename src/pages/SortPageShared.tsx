import { useSearchParams } from "react-router-dom";
import SortPage from "./SortPage";
import { useEffect, useState } from "react";

interface Props<T> {
  initialized: boolean;
  members: Map<string, T>;
  name_render_function: (membeer: T) => string;
  profile_render_function?: (membeer: T) => string[];
  set_custom_params?: (groups_bitset: string | null, include_og: boolean, include_not_debut: boolean, date_from: string | null, date_to: string | null) => void;
  share_url?: string;
}

/**
 * ソート画面
 * ソートが完了するとソート結果表示画面に遷移する
 * @param props 
 * @returns 
 */
export default function SortPageShared<T extends {}>(props: Props<T>) {
  const [searchParams] = useSearchParams();
  const [initializedInternal, setInitializedInternal] = useState<boolean>(false);
  const {initialized, members, set_custom_params, share_url} = props;
  const sortTitle = searchParams.get("sort_title") === null ? undefined : searchParams.get("sort_title")!;

  useEffect(() => {
    if (initialized) {
      const groups_bit = searchParams.get("groups");
      const include_og = searchParams.get("include_og") === "True";
      const include_not_debut = searchParams.get("include_not_debut") === "True";
      const date_from = searchParams.get("date_from");
      const date_to = searchParams.get("date_to");
      set_custom_params?.(groups_bit, include_og, include_not_debut, date_from, date_to);
    }
  }, [initialized, searchParams, set_custom_params]);

  useEffect(() => {
    if (initialized && members.size > 0) {
      setInitializedInternal(true);
    }
  }, [members, initialized]);

  return <SortPage share_url={share_url} sort_name={sortTitle} members={members} initialized={initialized && initializedInternal} name_render_function={props.name_render_function} profile_render_function={props.profile_render_function} />
}
