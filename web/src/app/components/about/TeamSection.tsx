"use client";
import React from "react";

export default function TeamSection() {
  return (
    <section className="w-full py-20 bg-gradient-to-b from-[#bfd8f7] to-[#0a1a35]">
      <div className="max-w-6xl mx-auto px-6 md:px-10 text-center">
        <h2 className="text-4xl font-bold mb-12 text-black">Our Team</h2>

        {/* Team Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 justify-center">
          {/* Member 1 */}
          <div className="flex flex-col items-center">
            <div className="w-48 h-48 rounded-3xl overflow-hidden bg-yellow-400 flex justify-center items-center">
              <img
                src="/images/faiz.jpg"
                alt="M. Arif Alfa’iz"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="mt-4 text-xl font-semibold text-white">
              M. Arif Alfa’iz
            </h3>
            <p className="text-gray-300 text-sm">
              UIUX Design & Frontend Developer
            </p>
          </div>

          {/* Member 2 */}
          <div className="flex flex-col items-center">
            <div className="w-48 h-48 rounded-3xl overflow-hidden bg-yellow-400 flex justify-center items-center">
              <img
                src="/images/faiz.jpg"
                alt="Fadly Mustofainal A."
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="mt-4 text-xl font-semibold text-white">
              Fadly Mustofainal A.
            </h3>
            <p className="text-gray-300 text-sm">
              UIUX Design & Frontend Developer
            </p>
          </div>

          {/* Member 3 */}
          <div className="flex flex-col items-center">
            <div className="w-48 h-48 rounded-3xl overflow-hidden bg-gray-300 flex justify-center items-center">
              <img
                src="/images/faiz.jpg"
                alt="Raditya Ahmad"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="mt-4 text-xl font-semibold text-white">
              Raditya Ahmad
            </h3>
            <p className="text-gray-300 text-sm">Backend Developer</p>
          </div>
        </div>
      </div>

      {/* Maps Section */}
      <div className="max-w-6xl mx-auto px-6 md:px-10 mt-16">
        <div className="w-full h-80 rounded-3xl overflow-hidden shadow-lg">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3970.461886868848!2d105.26573777499689!3d-5.382733754080243!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e40dbf48bb3dfdd%3A0x5ec52ffb0a1c1d02!2sUniversitas%20Teknokrat%20Indonesia!5e0!3m2!1sen!2sid!4v1700000000000!5m2!1sen!2sid"
            width="100%"
            height="100%"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </section>
  );
}
