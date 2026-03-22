import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { subscribeToReports } from '../../firebase/services';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const getMarkerIcon = (priority) => {
  const colors = { 'High': '#EF4444', 'Medium': '#F97316', 'Low': '#22C55E' };
  const color = colors[priority] || '#138808';
  return L.divIcon({
    className: 'custom-leaflet-icon',
    html: `<div style="background-color: ${color}; width: 18px; height: 18px; border-radius: 50%; border: 3px solid white; box-shadow: 0 3px 6px rgba(0,0,0,0.3);"></div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9]
  });
};

function MapBounds({ reports }) {
  const map = useMap();
  useEffect(() => {
    const validReports = reports.filter(r => r.location?.lat && r.location?.lng);
    if (validReports.length > 0) {
      const bounds = L.latLngBounds(validReports.map(m => [m.location.lat, m.location.lng]));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }
  }, [reports, map]);
  return null;
}

export default function Heatmap() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const unsubscribe = subscribeToReports(setReports);
    return () => unsubscribe();
  }, []);

  return (
    <div className="h-full flex flex-col space-y-4 relative">
      <div className="flex justify-between items-center z-10 shrink-0 mb-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Geospatial Heatmap</h1>
          <p className="text-slate-500 text-sm mt-1">Live clustering of reported issues via Firestore.</p>
        </div>
        
        <div className="bg-white/95 backdrop-blur-md px-4 py-2 border border-slate-200 shadow-sm rounded-xl flex items-center gap-4 text-[11px] font-bold text-slate-700 uppercase tracking-wide">
          <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-inner"></div> High</div>
          <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-orange-500 shadow-inner"></div> Mod</div>
          <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-inner"></div> Low</div>
        </div>
      </div>

      <div className="flex-1 rounded-[1.5rem] overflow-hidden shadow-sm border border-slate-200 relative z-0 bg-slate-100">
        <MapContainer 
          center={[12.9716, 77.5946]} 
          zoom={11} 
          style={{ height: '100%', width: '100%', borderRadius: '1.5rem' }}
          zoomControl={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />
          <MapBounds reports={reports} />
          
          {reports.map((report) => report.location?.lat ? (
            <Marker 
              key={report.id} 
              position={[report.location.lat, report.location.lng]}
              icon={getMarkerIcon(report.priority)}
            >
              <Popup className="custom-popup border-none rounded-xl overflow-hidden">
                <div className="font-sans min-w-[200px] p-1">
                  <h3 className="font-bold text-slate-900 text-[13px] mb-1 leading-tight">{report.title}</h3>
                  <p className="text-[11px] text-slate-500 mb-2 leading-relaxed">{report.description}</p>
                  <div className="text-[10px] font-bold tracking-widest uppercase text-slate-400 flex justify-between pt-2 border-t border-slate-100 mt-2">
                    <span>{report.createdAtStr?.split(',')[0]}</span>
                    <span className="text-indiaGreen">{report.status}</span>
                  </div>
                </div>
              </Popup>
            </Marker>
          ) : null)}
        </MapContainer>
      </div>
    </div>
  );
}
