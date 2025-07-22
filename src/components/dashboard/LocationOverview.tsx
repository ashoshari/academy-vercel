"use client";

import { MapContainer, TileLayer, Marker, Tooltip } from "react-leaflet";
import L from "leaflet";

import { useMemo } from "react";

export default function MapView({ data }: { data: any }) {
  console.log("data", data);
  const customIcon = useMemo(
    () =>
      new L.Icon({
        iconUrl: "/pop-up-shop.png",
        iconSize: [35, 35],
        iconAnchor: [17, 35],
        popupAnchor: [0, -35],
      }),
    []
  );

  return (
    <MapContainer
      center={[23.4667, 54.3667]}
      zoom={6.5}
      scrollWheelZoom={true}
      style={{
        height: "600px",
        width: "100%",
        borderRadius: "16px",
        overflow: "hidden",
      }}
      zoomControl={true}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* حدود الإمارات */}
      {/* <GeoJSON
        data={uaeBorders as GeoJSON.FeatureCollection}
        style={{ color: "#0000ff70", weight: 1.5 }}
      /> */}

      {/* عرض المحلات */}
      {data?.map((store: any, index: any) => (
        <Marker
          key={index}
          position={[store.latitude, store.longitude]}
          icon={customIcon}
        >
          <Tooltip direction="top" offset={[0, -20]} permanent>
            {store.name} ({store.pending_orders_count})
          </Tooltip>
        </Marker>
      ))}
    </MapContainer>
  );
}
