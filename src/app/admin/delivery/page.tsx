"use client";

import { useEffect, useState } from "react";
import { Truck, Phone, Bike, Car, User } from "lucide-react";

interface DeliveryPerson {
  id: number;
  name: string;
  phone: string;
  vehicle: string | null;
  isActive: boolean | null;
  currentOrders: number | null;
  totalDeliveries: number | null;
}

export default function AdminDelivery() {
  const [persons, setPersons] = useState<DeliveryPerson[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/delivery-persons")
      .then((r) => r.json())
      .then((data) => {
        setPersons(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const getVehicleIcon = (vehicle: string | null) => {
    switch (vehicle?.toLowerCase()) {
      case "motorcycle": return Bike;
      case "bicycle": return Bike;
      case "auto": return Car;
      default: return Truck;
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Delivery Partners</h1>
        <span className="text-sm text-gray-500">{persons.length} partners</span>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 shimmer h-32" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {persons.map((person) => {
            const VehicleIcon = getVehicleIcon(person.vehicle);
            return (
              <div
                key={person.id}
                className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-sm transition"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900">{person.name}</h3>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          person.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {person.isActive ? "ACTIVE" : "OFFLINE"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-1">
                      <Phone className="w-3.5 h-3.5" /> {person.phone}
                    </div>
                    <div className="flex items-center gap-4 mt-3 text-xs">
                      <span className="flex items-center gap-1 text-gray-600">
                        <VehicleIcon className="w-3.5 h-3.5" /> {person.vehicle || "N/A"}
                      </span>
                      <span className="flex items-center gap-1 text-gray-600">
                        <Truck className="w-3.5 h-3.5" /> {person.totalDeliveries || 0} deliveries
                      </span>
                      {(person.currentOrders ?? 0) > 0 && (
                        <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded font-bold">
                          {person.currentOrders} active
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
