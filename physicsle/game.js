const MAX_GUESSES = 4;
const DAILY_DONE_KEY = "physicsle_daily_done_v1";

const PHENOMENA = [
  {name:"Doppler Effect", description:"The apparent change in frequency of a wave when the source and observer are moving relative to each other. Commonly noticed when a siren approaches and then recedes."},
  {name:"Rayleigh Scattering", description:"The scattering of light by particles much smaller than the wavelength of the light, responsible for the blue color of the daytime sky."},
  {name:"Cherenkov Radiation", description:"Electromagnetic radiation emitted when a charged particle passes through a medium at a speed greater than the phase velocity of light in that medium, producing a characteristic blue glow."},
  {name:"Photoelectric Effect", description:"The emission of electrons from a material when light of sufficient frequency shines on it. The energy of emitted electrons depends on frequency, not intensity."},
  {name:"Brownian Motion", description:"The random, erratic movement of microscopic particles suspended in a fluid, caused by collisions with the fast-moving molecules of the fluid."},
  {name:"Bernoulli Effect", description:"A decrease in fluid pressure that occurs when the speed of the fluid increases. It helps explain how airplane wings generate lift."},
  {name:"Coriolis Effect", description:"The apparent deflection of moving objects when viewed from a rotating reference frame, responsible for the rotation of weather systems on Earth."},
  {name:"Superconductivity", description:"A phenomenon where certain materials exhibit zero electrical resistance and expulsion of magnetic fields when cooled below a critical temperature."},
  {name:"Refraction", description:"The bending of a wave as it passes from one medium to another with a different density, causing a straw in water to appear broken."},
  {name:"Diffraction", description:"The bending and spreading of waves around obstacles or through openings, allowing sound to be heard around corners."},
  {name:"Total Internal Reflection", description:"When a light ray hits a boundary at an angle greater than the critical angle, it is completely reflected back into the medium rather than passing through."},
  {name:"Electromagnetic Induction", description:"The production of an electromotive force across a conductor when it is exposed to a changing magnetic field, the principle behind generators and transformers."},
  {name:"Piezoelectricity", description:"The generation of an electric charge in certain materials in response to applied mechanical stress. Used in lighters, microphones, and quartz watches."},
  {name:"Triboluminescence", description:"The emission of light when a material is mechanically pulled apart, ripped, scratched, crushed, or rubbed. Seen when crushing certain candies in the dark."},
  {name:"Sonoluminescence", description:"The emission of short bursts of light from imploding bubbles in a liquid when excited by sound waves."},
  {name:"Bioluminescence", description:"The production and emission of light by living organisms through chemical reactions, as seen in fireflies and deep-sea creatures."},
  {name:"Superfluidity", description:"A state of matter in which a fluid flows with zero viscosity, able to climb container walls and flow through microscopic pores without friction."},
  {name:"Capillary Action", description:"The ability of a liquid to flow in narrow spaces against the force of gravity, due to surface tension and adhesion. This is how plants draw water upward."},
  {name:"Surface Tension", description:"The elastic tendency of a fluid surface to minimize its area, caused by cohesive forces between molecules. It allows insects to walk on water."},
  {name:"Quantum Tunneling", description:"A quantum mechanical phenomenon where a particle passes through a potential energy barrier that it classically could not surmount."},
  {name:"Wave-Particle Duality", description:"The concept that every quantum entity exhibits both wave and particle properties. Demonstrated by the double-slit experiment with electrons."},
  {name:"Blackbody Radiation", description:"The electromagnetic radiation emitted by an idealized object that absorbs all incident radiation. Its spectrum depends only on temperature."},
  {name:"Hawking Radiation", description:"Theoretical radiation predicted to be emitted by black holes due to quantum effects near the event horizon, causing them to slowly lose mass and eventually evaporate."},
  {name:"Gravitational Lensing", description:"The bending of light from distant objects by the gravitational field of a massive object between the source and observer, distorting or magnifying the image."},
  {name:"Redshift", description:"The increase in wavelength and decrease in frequency of electromagnetic radiation from an object moving away from the observer, used to measure the expansion of the universe."},
  {name:"Time Dilation", description:"The difference in elapsed time measured by two clocks due to a difference in their velocity or gravitational potential, as predicted by relativity."},
  {name:"Lenz's Law", description:"The direction of an induced current is always such that it opposes the change in magnetic flux that produced it, a consequence of conservation of energy."},
  {name:"Meissner Effect", description:"The complete expulsion of magnetic field lines from the interior of a superconductor as it transitions to the superconducting state, enabling magnetic levitation."},
  {name:"Hall Effect", description:"The production of a voltage difference across an electrical conductor when a magnetic field is applied perpendicular to the current flow."},
  {name:"Compton Scattering", description:"The decrease in energy of a photon when it interacts with a free charged particle, demonstrating the particle nature of light."},
  {name:"Pair Production", description:"The creation of a particle and its antiparticle from a photon interacting with a strong electromagnetic field, converting energy into mass."},
  {name:"Leidenfrost Effect", description:"A phenomenon where a liquid, in near contact with a surface significantly hotter than its boiling point, produces a vapor layer that insulates it and causes it to hover."},
  {name:"Eddy Currents", description:"Loops of electrical current induced within conductors by a changing magnetic field. They cause braking forces in magnetic braking systems."},
  {name:"Resonance", description:"The tendency of a system to oscillate with greater amplitude at certain frequencies, which match the system's natural frequencies. It can cause bridges to sway."},
  {name:"Interference", description:"The phenomenon where two waves superpose to form a resultant wave of greater, lower, or the same amplitude. Creates bright and dark fringes in light experiments."},
  {name:"Polarization", description:"The property of waves that describes the orientation of their oscillations. For light, it restricts vibrations to a single plane, used in sunglasses and LCD screens."},
  {name:"Thermoelectric Effect", description:"The direct conversion of temperature differences to electric voltage and vice versa, used in thermocouples and solid-state cooling devices."},
  {name:"Entropy", description:"A measure of the disorder or randomness in a system. The second law of thermodynamics states it always increases in an isolated system."},
  {name:"Centripetal Force", description:"The force that keeps an object moving in a circular path, always directed toward the center of rotation. Without it, the object would travel in a straight line."},
  {name:"Precession", description:"The slow, conical motion of the rotation axis of a spinning body, such as a wobbling top or the gradual shift of Earth's axial orientation over thousands of years."},
  {name:"Parallax", description:"The apparent shift in the position of an object when viewed from two different vantage points. Used to measure distances to nearby stars."},
  {name:"Buoyancy", description:"The upward force exerted on an object immersed in a fluid, equal to the weight of the fluid displaced. It explains why ships float despite being made of steel."},
  {name:"Inertia", description:"The tendency of an object to resist changes in its state of motion. An object at rest stays at rest, and an object in motion stays in motion unless acted upon by a force."},
  {name:"Friction", description:"The resistive force that opposes the relative motion of two surfaces in contact. Without it, walking and driving would be impossible."},
  {name:"Elasticity", description:"The ability of a material to return to its original shape after being deformed by an external force, like a rubber band snapping back after being stretched."},
  {name:"Radioactive Decay", description:"The spontaneous transformation of an unstable atomic nucleus into a lighter nucleus, accompanied by the emission of particles or radiation."},
  {name:"Nuclear Fission", description:"The splitting of a heavy atomic nucleus into two or more lighter nuclei, releasing a large amount of energy. The process used in nuclear power plants."},
  {name:"Nuclear Fusion", description:"The combining of two light atomic nuclei to form a heavier nucleus, releasing enormous energy. The process that powers the Sun and other stars."},
  {name:"Aurora", description:"A natural light display in the sky caused by charged particles from the solar wind interacting with gases in the Earth's upper atmosphere near the poles."},
  {name:"Tidal Forces", description:"Gravitational effects that stretch a body along the line toward and away from the center of mass of another body, responsible for ocean tides and geological stresses on moons."},
  // ---- Additional entries (51-160) ----
  {name:"Archimedes' Principle", description:"Any object wholly or partially immersed in a fluid experiences an upward force equal to the weight of the fluid displaced by the object."},
  {name:"Pascal's Principle", description:"A change in pressure applied to an enclosed fluid is transmitted undiminished to every point in the fluid and to the walls of the container. The basis for hydraulic systems."},
  {name:"Hooke's Law", description:"The force needed to extend or compress a spring is proportional to the distance it is stretched or compressed, up to the elastic limit of the material."},
  {name:"Conservation of Momentum", description:"In a closed system with no external forces, the total momentum before and after a collision remains the same. It governs how billiard balls behave upon impact."},
  {name:"Conservation of Energy", description:"Energy cannot be created or destroyed, only transformed from one form to another. The total energy of an isolated system remains constant over time."},
  {name:"Ohm's Law", description:"The current through a conductor between two points is directly proportional to the voltage across the two points and inversely proportional to the resistance."},
  {name:"Coulomb's Law", description:"The electrostatic force between two charged objects is proportional to the product of their charges and inversely proportional to the square of the distance between them."},
  {name:"Snell's Law", description:"The ratio of the sines of the angles of incidence and refraction is equal to the ratio of the phase velocities in the two media. It governs how light bends at boundaries."},
  {name:"Stefan-Boltzmann Law", description:"The total energy radiated per unit surface area of a blackbody per unit time is proportional to the fourth power of its absolute temperature."},
  {name:"Wien's Displacement Law", description:"The wavelength at which the emission of a blackbody spectrum is at its peak is inversely proportional to the temperature. Hotter objects glow at shorter wavelengths."},
  {name:"Heisenberg Uncertainty Principle", description:"It is impossible to simultaneously know both the exact position and exact momentum of a particle. The more precisely one is known, the less precisely the other can be determined."},
  {name:"Pauli Exclusion Principle", description:"No two identical fermions can occupy the same quantum state simultaneously. This prevents electrons in an atom from all collapsing into the lowest energy level."},
  {name:"Casimir Effect", description:"A small attractive force between two close parallel uncharged conducting plates caused by quantum vacuum fluctuations of the electromagnetic field between them."},
  {name:"Zeeman Effect", description:"The splitting of a spectral line into several components when the light source is placed in a magnetic field, revealing the interaction between magnetism and atomic energy levels."},
  {name:"Stark Effect", description:"The shifting and splitting of spectral lines of atoms and molecules in the presence of an external electric field, analogous to the Zeeman effect but with electric fields."},
  {name:"Raman Scattering", description:"The inelastic scattering of a photon by a molecule, causing a change in the photon's energy and wavelength. Used to identify chemical compounds."},
  {name:"Mie Scattering", description:"The scattering of electromagnetic radiation by particles whose size is comparable to the wavelength. It explains the white appearance of clouds and fog."},
  {name:"Thomson Scattering", description:"The elastic scattering of electromagnetic radiation by a free charged particle at low energies, where the particle oscillates in the electric field of the incoming wave."},
  {name:"Bremsstrahlung", description:"Electromagnetic radiation produced when a charged particle is decelerated by another charged particle, such as an electron being deflected by an atomic nucleus."},
  {name:"Synchrotron Radiation", description:"Electromagnetic radiation emitted when charged particles travel in curved paths at relativistic speeds, such as in particle accelerators or around magnetic field lines in space."},
  {name:"Kerr Effect", description:"A change in the refractive index of a material in response to an applied electric field, making the material birefringent. Used in optical shutters and modulators."},
  {name:"Faraday Effect", description:"The rotation of the plane of polarization of light as it travels through a material in the presence of a magnetic field parallel to the direction of propagation."},
  {name:"Magneto-Optical Effect", description:"Changes in the optical properties of a material due to an applied magnetic field, including rotation of polarization and changes in absorption and reflection."},
  {name:"Siphon Effect", description:"The flow of liquid upward from a reservoir and then down to a lower level through a tube, driven by the difference in liquid levels and atmospheric pressure."},
  {name:"Venturi Effect", description:"The reduction in fluid pressure that results when a fluid flows through a constricted section of a pipe, causing an increase in fluid velocity."},
  {name:"Magnus Effect", description:"A force on a spinning object moving through a fluid, causing it to curve away from its principal flight path. It explains the curve of a spinning baseball or soccer ball."},
  {name:"Coanda Effect", description:"The tendency of a fluid jet to stay attached to a convex surface rather than following a straight path. Used in aircraft design and ventilation systems."},
  {name:"Cavitation", description:"The formation and collapse of vapor bubbles in a liquid due to rapid changes in pressure. It can damage ship propellers and pump impellers."},
  {name:"Viscosity", description:"A fluid's resistance to deformation at a given rate. Honey has high viscosity and flows slowly, while water has low viscosity and flows easily."},
  {name:"Turbulence", description:"Chaotic, irregular fluid motion characterized by eddies and vortices that occur at high flow velocities, as opposed to smooth laminar flow."},
  {name:"Laminar Flow", description:"A smooth, orderly fluid motion in which layers slide past each other without mixing. It occurs at low velocities and in narrow tubes."},
  {name:"Vortex", description:"A spinning flow of fluid revolving around a central axis. Examples include tornadoes, whirlpools, and the swirling of water draining from a bathtub."},
  {name:"Soliton", description:"A self-reinforcing wave packet that maintains its shape while propagating at a constant velocity, first observed as a water wave in a canal in 1834."},
  {name:"Shock Wave", description:"A type of propagating disturbance that moves faster than the local speed of sound in the medium, creating a sudden change in pressure, temperature, and density."},
  {name:"Sonic Boom", description:"The explosive sound caused by the shock waves created when an object travels through the air faster than the speed of sound."},
  {name:"Standing Wave", description:"A wave that remains in a constant position, formed by the interference of two waves traveling in opposite directions. Seen in vibrating guitar strings."},
  {name:"Harmonics", description:"Integer multiples of a fundamental frequency of vibration. They determine the timbre of musical instruments and occur in vibrating strings, air columns, and other systems."},
  {name:"Acoustic Resonance", description:"The tendency of an acoustic system to absorb more energy when the frequency of its oscillations matches the system's natural frequency. It amplifies sound in instruments."},
  {name:"Doppler Cooling", description:"A technique that uses the Doppler effect to slow atoms with precisely tuned lasers, cooling them to temperatures near absolute zero."},
  {name:"Bose-Einstein Condensation", description:"A state of matter formed when particles called bosons are cooled to near absolute zero, causing them to occupy the same quantum state and behave as a single quantum entity."},
  {name:"Fermi Condensate", description:"A superfluid state of matter formed at extremely low temperatures by fermions, analogous to a Bose-Einstein condensate but made of particles that obey the Pauli exclusion principle."},
  {name:"Supercooling", description:"The process of lowering the temperature of a liquid below its freezing point without it becoming a solid. The liquid crystallizes rapidly when disturbed."},
  {name:"Superheating", description:"Heating a liquid above its boiling point without it actually boiling, because there are no nucleation sites for bubble formation. It can cause sudden explosive boiling."},
  {name:"Regelation", description:"The phenomenon of ice melting under pressure and refreezing when the pressure is removed. It allows a wire under tension to pass through a block of ice."},
  {name:"Sublimation", description:"The transition of a substance directly from the solid phase to the gas phase without passing through the liquid phase, as when dry ice turns to carbon dioxide gas."},
  {name:"Triple Point", description:"The unique temperature and pressure at which the three phases of a substance (solid, liquid, and gas) coexist in thermodynamic equilibrium."},
  {name:"Curie Point", description:"The temperature above which a ferromagnetic material loses its permanent magnetic properties and becomes paramagnetic."},
  {name:"Magnetostriction", description:"The change in shape and dimensions of a material when it is magnetized. It causes the humming sound often heard from electrical transformers."},
  {name:"Ferromagnetism", description:"The mechanism by which certain materials form permanent magnets or are attracted to magnets. It is caused by aligned magnetic moments of atoms in the material."},
  {name:"Paramagnetism", description:"A form of magnetism where materials are weakly attracted by a magnetic field and do not retain magnetization in the absence of an external field."},
  {name:"Diamagnetism", description:"A property of all materials that causes them to be weakly repelled by a magnetic field. It is the reason a frog can levitate in a strong enough magnetic field."},
  {name:"Quantum Entanglement", description:"A phenomenon where two particles become correlated such that the quantum state of one instantly influences the other, regardless of the distance separating them."},
  {name:"Quantum Superposition", description:"The principle that a quantum system can exist in multiple states simultaneously until it is measured, at which point it collapses into one definite state."},
  {name:"Quantum Decoherence", description:"The process by which a quantum system loses its quantum behavior and begins to behave classically, due to interaction with its environment."},
  {name:"Electron Spin", description:"An intrinsic form of angular momentum carried by electrons, unrelated to any physical spinning. It gives rise to magnetism and is fundamental to the structure of atoms."},
  {name:"Photoionization", description:"The process by which an atom or molecule absorbs a photon of sufficient energy to eject one of its bound electrons, creating an ion."},
  {name:"Fluorescence", description:"The emission of light by a substance that has absorbed light or other electromagnetic radiation. The emitted light has a longer wavelength than the absorbed radiation."},
  {name:"Phosphorescence", description:"Similar to fluorescence, but the re-emitted light is released slowly over time rather than immediately, causing the material to glow in the dark after the light source is removed."},
  {name:"Electroluminescence", description:"The emission of light from a material when an electric current or electric field passes through it. This is the principle behind LED screens."},
  {name:"Thermionic Emission", description:"The emission of electrons from a heated surface, which occurs because thermal energy gives some electrons enough kinetic energy to escape. Used in vacuum tubes."},
  {name:"Field Emission", description:"The extraction of electrons from a material surface by a strong electric field, even at low temperatures. Used in electron microscopes and field-emission displays."},
  {name:"Tunneling Magnetoresistance", description:"A quantum mechanical effect where the electrical resistance of a junction between two ferromagnets separated by a thin insulator depends on the relative alignment of their magnetizations."},
  {name:"Josephson Effect", description:"The flow of electric current between two superconductors separated by a thin non-superconducting barrier, without any applied voltage. Used in ultra-sensitive magnetometers."},
  {name:"Skin Effect", description:"The tendency of alternating current to flow mostly near the outer surface of a conductor at high frequencies, reducing the effective cross-section and increasing resistance."},
  {name:"Dielectric Breakdown", description:"The rapid reduction in the resistance of an electrical insulator when the applied voltage exceeds a critical threshold, causing it to become electrically conductive. Lightning is an example."},
  {name:"Corona Discharge", description:"An electrical discharge caused by the ionization of air surrounding a conductor when the electric field exceeds a certain value. It appears as a bluish glow near sharp points."},
  {name:"Triboelectric Effect", description:"The transfer of electric charge between two materials brought into contact and then separated. It is the cause of static electricity from rubbing a balloon on hair."},
  {name:"Electrostatic Induction", description:"The redistribution of electric charge in an object caused by the influence of nearby charges, without direct contact. It is how an electroscope detects charge."},
  {name:"Faraday Cage", description:"An enclosure made of conducting material that blocks external static and non-static electric fields. Electronic devices inside are shielded from electromagnetic interference."},
  {name:"Electromagnetic Shielding", description:"The practice of using conductive or magnetic materials to reduce the electromagnetic field in a space by blocking it. Used to protect sensitive electronics."},
  {name:"Gravitational Redshift", description:"The reddening of light emitted from a source in a strong gravitational field, as the light loses energy climbing out of the gravity well. Predicted by general relativity."},
  {name:"Frame Dragging", description:"An effect predicted by general relativity where a rotating massive object drags spacetime around with it, affecting the motion of nearby objects and light."},
  {name:"Gravitational Waves", description:"Ripples in spacetime caused by the acceleration of massive objects, such as merging black holes. First directly detected by LIGO in 2015."},
  {name:"Tidal Locking", description:"A situation where an orbiting body always shows the same face to the object it orbits because its orbital period matches its rotation period. The Moon is tidally locked to Earth."},
  {name:"Roche Limit", description:"The minimum distance at which a celestial body held together only by gravity can orbit a larger body without being torn apart by tidal forces."},
  {name:"Spaghettification", description:"The vertical stretching and horizontal compression of objects into long thin shapes in a very strong non-uniform gravitational field, such as near a black hole."},
  {name:"Cosmic Microwave Background", description:"The faint electromagnetic radiation filling all of space, left over from the early universe about 380,000 years after the Big Bang. It has a temperature of about 2.7 Kelvin."},
  {name:"Hubble's Law", description:"The observation that galaxies are receding from each other at speeds proportional to their distance, providing evidence for the expansion of the universe."},
  {name:"Dark Energy", description:"A hypothetical form of energy that permeates all of space and drives the accelerating expansion of the universe, making up about 68 percent of the total energy content."},
  {name:"Dark Matter", description:"A form of matter that does not interact with electromagnetic radiation but exerts gravitational effects on visible matter. It accounts for about 27 percent of the universe's mass-energy."},
  {name:"Neutron Degeneracy Pressure", description:"The quantum mechanical pressure that prevents neutron stars from collapsing further under gravity, arising from the Pauli exclusion principle applied to neutrons."},
  {name:"Chandrasekhar Limit", description:"The maximum mass of a stable white dwarf star, approximately 1.4 solar masses. Above this limit, the star will collapse into a neutron star or black hole."},
  {name:"Doppler Broadening", description:"The broadening of spectral lines due to the random thermal motion of atoms or molecules. Hotter gases produce wider spectral lines because their atoms move faster."},
  {name:"Adiabatic Process", description:"A thermodynamic process in which no heat is transferred to or from the system. Rapid compression of air in a bicycle pump causes heating through this process."},
  {name:"Isothermal Process", description:"A thermodynamic change of state during which the temperature remains constant, requiring heat exchange with the surroundings to compensate for work done."},
  {name:"Carnot Cycle", description:"The most efficient possible heat engine cycle, consisting of two isothermal and two adiabatic processes. No real engine can exceed its theoretical efficiency."},
  {name:"Joule-Thomson Effect", description:"The change in temperature of a real gas or liquid when it is forced through a valve or porous plug while kept insulated. Used in refrigeration and liquefaction of gases."},
  {name:"Heat Conduction", description:"The transfer of thermal energy through a material from a region of higher temperature to a region of lower temperature, without bulk movement of the material."},
  {name:"Convection", description:"The transfer of heat by the bulk movement of a fluid. Warm fluid rises and cool fluid sinks, creating circulation patterns in the atmosphere and in boiling water."},
  {name:"Thermal Radiation", description:"The emission of electromagnetic waves from all matter that has a temperature above absolute zero. It is how the Sun's energy reaches Earth through the vacuum of space."},
  {name:"Mpemba Effect", description:"The counterintuitive observation that, under certain conditions, warm water can freeze faster than cold water. The exact mechanisms are still debated."},
  {name:"Joule Heating", description:"The process by which the passage of an electric current through a conductor produces heat, proportional to the square of the current and the resistance. It powers electric heaters."},
  {name:"Seebeck Effect", description:"The generation of an electromotive force in a circuit of two dissimilar metals when their junctions are at different temperatures. The basis of thermocouples."},
  {name:"Peltier Effect", description:"The heating or cooling at a junction of two different conductors when an electric current flows through it. Used in portable coolers and precision temperature controllers."},
  {name:"Pyroelectricity", description:"The generation of a temporary voltage in certain crystals when they are heated or cooled. Unlike piezoelectricity, the stimulus is a change in temperature rather than stress."},
  {name:"Birefringence", description:"The optical property of a material in which light is split into two rays traveling at different speeds, producing a double image. Calcite crystals display this effect."},
  {name:"Chromatic Aberration", description:"An optical defect in which a lens fails to focus all colors to the same convergence point, causing colored fringes around the edges of images."},
  {name:"Rayleigh Criterion", description:"The minimum angular separation at which two point sources of light can be distinguished as separate through an optical system, determined by diffraction."},
  {name:"Brewster's Angle", description:"The angle of incidence at which light reflected from a surface is perfectly polarized. At this angle, the reflected and refracted rays are perpendicular to each other."},
  {name:"Optical Fiber Guidance", description:"The transmission of light through flexible glass or plastic fibers by means of total internal reflection, enabling high-speed data communication over long distances."},
  {name:"Dispersion", description:"The separation of white light into its component colors when passing through a prism, caused by the different refractive indices for different wavelengths."},
  {name:"Absorption Spectrum", description:"A pattern of dark lines or bands in a continuous spectrum, caused by the absorption of specific wavelengths of light by atoms or molecules in a cooler medium."},
  {name:"Emission Spectrum", description:"A pattern of bright lines at specific wavelengths produced when excited atoms return to lower energy states, unique to each element like a fingerprint."},
];

/* ---- Hints ---- */
function getHint(answer, guessNum) {
  switch (guessNum) {
    case 1: return `Starts with "${answer[0]}".`;
    case 2: return `${answer.length} letters. Starts with "${answer[0]}".`;
    case 3: return `"${answer.slice(0, Math.ceil(answer.length / 3))}…" (${answer.length} letters).`;
    default: return "";
  }
}

/* ---- Search dropdown ---- */
function setupSearch(allNames) {
  const input = $("guessInput");
  const dropdown = $("dropdown");
  let selected = null;
  let filtered = [];
  let activeIdx = -1;

  function render(list) {
    dropdown.innerHTML = "";
    filtered = list;
    activeIdx = -1;
    if (!list.length) { dropdown.hidden = true; return; }
    dropdown.hidden = false;
    list.slice(0, 8).forEach((name) => {
      const div = document.createElement("div");
      div.className = "dropdown-item";
      div.textContent = name;
      div.addEventListener("mousedown", (e) => { e.preventDefault(); pick(name); });
      dropdown.appendChild(div);
    });
  }

  function pick(name) {
    selected = name;
    input.value = name;
    dropdown.hidden = true;
  }

  input.addEventListener("input", () => {
    selected = null;
    const q = input.value.trim().toLowerCase();
    if (q.length < 1) { dropdown.hidden = true; return; }
    const matches = allNames.filter(c => c.toLowerCase().includes(q));
    render(matches);
  });

  input.addEventListener("keydown", (e) => {
    const items = dropdown.querySelectorAll(".dropdown-item");
    if (e.key === "ArrowDown") {
      e.preventDefault();
      activeIdx = Math.min(activeIdx + 1, items.length - 1);
      items.forEach((el, i) => el.classList.toggle("active", i === activeIdx));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      activeIdx = Math.max(activeIdx - 1, 0);
      items.forEach((el, i) => el.classList.toggle("active", i === activeIdx));
    } else if (e.key === "Enter" && activeIdx >= 0 && filtered[activeIdx]) {
      e.preventDefault();
      pick(filtered[activeIdx]);
    }
  });

  input.addEventListener("blur", () => {
    setTimeout(() => { dropdown.hidden = true; }, 150);
  });

  return () => {
    const val = selected || input.value.trim();
    selected = null;
    input.value = "";
    return val;
  };
}

/* ---- Share ---- */
function buildShareText(puzzleNo, history, solved, guessesUsed) {
  const emojis = history.map(h => h.correct ? "🟩" : "🟥").join("");
  const score = solved ? `${guessesUsed}/${MAX_GUESSES}` : `X/${MAX_GUESSES}`;
  return `Physicsle #${puzzleNo} ⚛️\n${emojis}\n${score}\nhttps://daily-le.com/physicsle/`;
}

/* ---- Main ---- */
(function main() {
  const today = todayLocalISO();
  const puzzleNo = gameNumberFromDate(today);
  setText("dayPill", `#${puzzleNo} — ${today}`);
  setText("triesPill", `Guesses: 0/${MAX_GUESSES}`);

  const chosen = pickFromBag(PHENOMENA, "physicsle", today);
  setText("descriptionText", chosen.description);

  const allNames = PHENOMENA.map(p => p.name).sort();
  const getGuess = setupSearch(allNames);

  let guesses = 0;
  let solved = false;
  const history = [];

  // Already played
  if (localStorage.getItem(DAILY_DONE_KEY) === today) {
    $("guessInput").disabled = true;
    $("guessBtn").disabled = true;
    setText("endTitle", "Already played today");
    setText("endBody", `The answer was: ${chosen.name}`);
    $("shareBtn").disabled = false;
    $("shareTopBtn").disabled = false;
    showModal();
    return;
  }

  function endGame(win) {
    solved = win;
    $("guessInput").disabled = true;
    $("guessBtn").disabled = true;
    localStorage.setItem(DAILY_DONE_KEY, today);

    setText("endTitle", win ? "You got it! ⚛️" : "Not this time ❌");
    setText("endBody", `The answer was: ${chosen.name}`);

    const grid = $("emojiGrid");
    if (grid) {
      grid.textContent = "";
      history.forEach(h => {
        const s = document.createElement("span");
        s.textContent = h.correct ? "🟩" : "🟥";
        grid.appendChild(s);
      });
      if (!win) {
        const s = document.createElement("span"); s.textContent = "❌"; grid.appendChild(s);
      }
    }

    $("shareBtn").disabled = false;
    $("shareTopBtn").disabled = false;
    showModal();
  }

  $("guessForm").addEventListener("submit", (e) => {
    e.preventDefault();
    setText("errorLine", "");
    if (solved) return;

    const guess = getGuess();
    if (!guess) {
      setText("errorLine", "Type a phenomenon name.");
      return;
    }

    guesses++;
    const correct = guess.toLowerCase().trim() === chosen.name.toLowerCase().trim();
    history.push({ name: guess, correct });

    setText("triesPill", `Guesses: ${guesses}/${MAX_GUESSES}`);

    const histEl = $("history");
    const row = document.createElement("div");
    row.className = "history-row";
    row.innerHTML = `
      <span class="emoji">${correct ? "🟩" : "🟥"}</span>
      <span class="name">${guess}</span>
      <span class="tag ${correct ? "good" : "bad"}">${correct ? "Correct!" : "Wrong"}</span>
    `;
    histEl.prepend(row);

    if (correct) { endGame(true); return; }

    const hint = getHint(chosen.name, guesses);
    if (hint) setText("hintLine", "Hint: " + hint);

    if (guesses >= MAX_GUESSES) { endGame(false); return; }

    $("guessInput").focus();
  });

  // Share
  function currentShareText() {
    return buildShareText(puzzleNo, history, solved, guesses);
  }
  $("shareBtn")?.addEventListener("click", () => shareNice("Physicsle", currentShareText(), "https://daily-le.com/physicsle/"));
  $("shareTopBtn")?.addEventListener("click", () => shareNice("Physicsle", currentShareText(), "https://daily-le.com/physicsle/"));

  $("closeStatsBtn")?.addEventListener("click", hideModal);
  $("statsBackdrop")?.addEventListener("click", hideModal);
})();
