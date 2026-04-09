#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import sys
from typing import Any

import modal


APP_NAME = "aip-processor"
FUNCTION_NAME = "render_remotion_cloud"


def _extract_url(result: Any) -> str | None:
    if isinstance(result, str):
        return result
    if not isinstance(result, dict):
        return None

    data = result.get("data")
    if isinstance(data, dict):
        url = data.get("url")
        if isinstance(url, str):
            return url

    url = result.get("url")
    if isinstance(url, str):
        return url
    return None


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--git-sha", required=True)
    parser.add_argument("--composition-id", default="TextEffects")
    parser.add_argument("--from-seconds", type=float)
    parser.add_argument("--to-seconds", type=float)
    parser.add_argument("--scale", type=float)
    parser.add_argument("--crf", type=int)
    parser.add_argument("--concurrency", type=int)
    parser.add_argument("--delay-render-timeout-ms", type=int)
    parser.add_argument("--storage-prefix", default="share")
    parser.add_argument("--no-hq", action="store_true")
    args = parser.parse_args()

    kwargs: dict[str, Any] = {
        "composition_id": args.composition_id,
        "hq": not args.no_hq,
        "storage_prefix": args.storage_prefix,
    }
    if args.from_seconds is not None:
        kwargs["from_seconds"] = args.from_seconds
    if args.to_seconds is not None:
        kwargs["to_seconds"] = args.to_seconds
    if args.scale is not None:
        kwargs["scale"] = args.scale
    if args.crf is not None:
        kwargs["crf"] = args.crf
    if args.concurrency is not None:
        kwargs["concurrency"] = args.concurrency
    if args.delay_render_timeout_ms is not None:
        kwargs["delay_render_timeout_ms"] = args.delay_render_timeout_ms

    with modal.enable_output(show_progress=True, show_timestamps=True):
        func = modal.Function.from_name(APP_NAME, FUNCTION_NAME)
        call = func.spawn(args.git_sha, **kwargs)
        print(f"Modal function call: {call.object_id}", flush=True)
        print(f"Dashboard URL: {call.get_dashboard_url()}", flush=True)
        result = call.get()

    url = _extract_url(result)
    if url:
        print(f"FINAL_URL: {url}", flush=True)
    else:
        print("RESULT_JSON:", json.dumps(result, sort_keys=True), flush=True)

    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except modal.exception.ExecutionError as exc:
        print(f"Modal execution failed: {exc}", file=sys.stderr)
        raise SystemExit(1) from exc
    except modal.exception.TimeoutError as exc:
        print(f"Modal call timed out: {exc}", file=sys.stderr)
        raise SystemExit(1) from exc
