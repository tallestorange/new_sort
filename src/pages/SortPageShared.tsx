import { useSearchParams } from "react-router-dom";
import SortPage from "./SortPage";
import { useEffect, useState } from "react";
import { Member } from "../hooks/useHPDatabase";

interface Props<T> {
  initialized: boolean;
  name_render_function: (membeer: T) => string;
  profile_render_function?: (membeer: T) => string[];
  set_custom_params?: (params: string | null) => void;
}

/**
 * ソート画面
 * ソートが完了するとソート結果表示画面に遷移する
 * @param props 
 * @returns 
 */
export default function SortPageShared<T extends {}>(props: Props<T>) {
  const [searchParams, set_custom_params] = useSearchParams();
  const [groups, setGroups] = useState<string | null>(searchParams.get("groups"));
  const [members, setMembers] = useState<Map<string, T>>(new Map<string, T>());
  const {initialized} = props;

  useEffect(() => {
    if (initialized) {
      props.set_custom_params?.(groups);
    }    
  }, [groups, initialized]);

  return <SortPage members={members} initialized={true} name_render_function={props.name_render_function} profile_render_function={props.profile_render_function} />
}
