import { useSearchParams } from "react-router-dom";
import SortPage from "./SortPage";
import { useEffect, useState } from "react";

interface Props<T> {
  initialized: boolean;
  members: Map<string, T>;
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
  const [searchParams] = useSearchParams();
  const [initializedInternal, setInitializedInternal] = useState<boolean>(false);
  const {initialized, members, set_custom_params} = props;

  useEffect(() => {
    if (initialized) {
      set_custom_params?.(searchParams.get("groups"));
    }
  }, [initialized, searchParams, set_custom_params]);

  useEffect(() => {
    if (initialized) {
      setInitializedInternal(true);
    }
  }, [members, initialized]);

  return <SortPage members={members} initialized={initialized && initializedInternal} name_render_function={props.name_render_function} profile_render_function={props.profile_render_function} />
}
