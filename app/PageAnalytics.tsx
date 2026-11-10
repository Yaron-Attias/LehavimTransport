"use client";

import { useEffect } from "react";

let started = false;

export default function PageAnalytics() {
  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
    const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;
    if (started || !token || !host || location.hostname === "localhost" || location.hostname === "127.0.0.1") return;
    started = true;
    void import("posthog-js").then(({ default: posthog }) => {
      posthog.init(token, {
        api_host: host,
        defaults: "2026-08-30",
        capture_pageview: true,
        disable_surveys: true,
        enable_heatmaps: false,
        rageclick: false,
        capture_pageleave: false,
        autocapture: false,
        disable_session_recording: true,
        capture_performance: false,
        capture_exceptions: false,
        capture_dead_clicks: false,
        person_profiles: "never",
        persistence: "memory",
        ip: false,
        // Keep only known screen names; discard arbitrary query values and child data.
        before_send: (event) => {
          if (!event || event.event !== "$pageview") return null;
          event.properties = {
            token: event.properties.token,
            distinct_id: event.properties.distinct_id,
            $current_url: location.origin + location.pathname,
            $host: location.host,
            $pathname: location.pathname,
            page_name: location.pathname === "/kids" ? "kids" : location.pathname === "/" ? (new URLSearchParams(location.search).get("view") === "admin" ? "admin" : "week") : "other",
            app: "lehavim-transport",
            $process_person_profile: false,
          };
          return event;
        },
      });
    }).catch(() => { started = false; });
  }, []);
  return null;
}
