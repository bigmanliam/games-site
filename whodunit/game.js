const MAX_GUESSES = 6;
const DAILY_DONE_KEY = "whodunit_daily_done_v1";

/* ---- Data: 160 famous people with 6 progressive clues each ---- */
const PEOPLE = [
  {name:"Albert Einstein", clues:["Born in Germany in 1879","Worked as a patent clerk in Switzerland","Published groundbreaking papers in 1905","Developed the theory of special relativity","Won the Nobel Prize in Physics in 1921","Famous equation: E=mc²"]},
  {name:"Leonardo da Vinci", clues:["Born in a small Italian town in 1452","Was left-handed and wrote in mirror script","Designed flying machines centuries before airplanes","Painted a famous fresco of the Last Supper","Studied anatomy by dissecting human bodies","Painted the Mona Lisa"]},
  {name:"Cleopatra", clues:["Ruled during the Ptolemaic dynasty","Spoke nine languages fluently","Formed political alliances through personal relationships","Allied with Julius Caesar","Her kingdom was in North Africa","Last active pharaoh of Egypt"]},
  {name:"William Shakespeare", clues:["Born in Stratford-upon-Avon in 1564","Married Anne Hathaway at age 18","Was part-owner of a playing company called the Lord Chamberlain's Men","Wrote 154 sonnets","Created characters like Hamlet, Othello, and Macbeth","Often called the Bard of Avon"]},
  {name:"Marie Curie", clues:["Born in Warsaw, Poland in 1867","Moved to Paris to study at the Sorbonne","First woman to win a Nobel Prize","Discovered two chemical elements","Died from aplastic anemia caused by radiation exposure","Pioneer in the study of radioactivity"]},
  {name:"Mahatma Gandhi", clues:["Studied law in London","Spent 21 years in South Africa","Led a famous march to the sea in 1930","Advocated for nonviolent civil disobedience","Called the Father of the Nation in India","Led India's independence movement against British rule"]},
  {name:"Napoleon Bonaparte", clues:["Born on the island of Corsica in 1769","Rose to prominence during the French Revolution","Crowned himself Emperor in 1804","Lost a famous battle in Russia due to winter","Exiled to Elba but escaped","Defeated at the Battle of Waterloo in 1815"]},
  {name:"Rosa Parks", clues:["Born in Tuskegee, Alabama in 1913","Worked as a seamstress in a department store","Was secretary of the local NAACP chapter","Her act of defiance sparked a 381-day boycott","Arrested on December 1, 1955","Refused to give up her bus seat in Montgomery"]},
  {name:"Isaac Newton", clues:["Born in Lincolnshire, England in 1642","Attended Trinity College, Cambridge","Was Warden and Master of the Royal Mint","Published the Principia Mathematica","An apple supposedly inspired his greatest discovery","Formulated the laws of gravity and motion"]},
  {name:"Frida Kahlo", clues:["Born in Coyoacan, Mexico in 1907","Survived a devastating bus accident as a teenager","Married fellow artist Diego Rivera twice","Created 55 self-portraits","Known for painting with vivid colors and symbolic imagery","One of Mexico's most celebrated artists"]},
  {name:"Martin Luther King Jr.", clues:["Born in Atlanta, Georgia in 1929","Earned a doctorate in theology from Boston University","Led the Montgomery Bus Boycott","Delivered a historic speech at the Lincoln Memorial","Won the Nobel Peace Prize in 1964","Famous words: I have a dream"]},
  {name:"Nikola Tesla", clues:["Born in modern-day Croatia in 1856","Worked briefly for Thomas Edison","Demonstrated wireless energy transmission","Held over 300 patents in his lifetime","Pioneered alternating current electrical systems","The electric car company is named after him"]},
  {name:"Queen Victoria", clues:["Became monarch at age 18 in 1837","Married her first cousin, Prince Albert","Had nine children who married into royal families across Europe","An entire era of British history bears her name","Was Empress of India","Ruled the United Kingdom for 63 years"]},
  {name:"Charles Darwin", clues:["Born in Shrewsbury, England in 1809","Originally studied medicine and then theology","Traveled the world on HMS Beagle for five years","Studied finches on the Galapagos Islands","Published a revolutionary book in 1859","Proposed the theory of evolution by natural selection"]},
  {name:"Nelson Mandela", clues:["Born in the Transkei region of South Africa in 1918","Studied law at the University of Witwatersrand","Was imprisoned for 27 years","Released from prison on February 11, 1990","Won the Nobel Peace Prize in 1993","Became South Africa's first Black president"]},
  {name:"Wolfgang Amadeus Mozart", clues:["Born in Salzburg, Austria in 1756","Composed his first piece at age five","Toured European courts as a child prodigy","Wrote over 600 compositions in his short life","Composed The Magic Flute and Don Giovanni","Died at 35; one of history's greatest classical composers"]},
  {name:"Amelia Earhart", clues:["Born in Atchison, Kansas in 1897","Worked as a nurse's aide during World War I","Set multiple aviation altitude records","First woman to fly solo across the Atlantic Ocean","Disappeared over the Pacific Ocean in 1937","America's most famous female aviator"]},
  {name:"Genghis Khan", clues:["Born around 1162 on the Mongolian steppe","United warring nomadic tribes","Established a postal relay system across Asia","His empire stretched from China to Eastern Europe","Founded the largest contiguous land empire in history","Born as Temujin, he became the Great Khan"]},
  {name:"Ada Lovelace", clues:["Born in London in 1815","Was the daughter of the poet Lord Byron","Worked with Charles Babbage on his Analytical Engine","Wrote what is considered the first computer algorithm","A modern programming language is named after her","Often called the first computer programmer"]},
  {name:"Pablo Picasso", clues:["Born in Malaga, Spain in 1881","His father was an art teacher","Co-founded the Cubist art movement","Created over 50,000 works of art in his lifetime","Painted a famous anti-war mural called Guernica","One of the most influential artists of the 20th century"]},
  {name:"Abraham Lincoln", clues:["Born in a log cabin in Kentucky in 1809","Was largely self-educated","Served as an Illinois state legislator","Delivered the Gettysburg Address in 1863","Issued the Emancipation Proclamation","16th President of the United States"]},
  {name:"Harriet Tubman", clues:["Born into slavery in Maryland around 1822","Escaped to freedom in Philadelphia","Served as a spy for the Union Army","Made 13 missions to rescue enslaved people","Used a network of safe houses known as the Underground Railroad","One of the most famous conductors of the Underground Railroad"]},
  {name:"Alexander the Great", clues:["Born in Pella, Macedonia in 356 BC","Was tutored by Aristotle","Became king at age 20 after his father's assassination","Never lost a single battle","Created an empire stretching from Greece to India","One of the most successful military commanders in history"]},
  {name:"Coco Chanel", clues:["Born in Saumur, France in 1883","Grew up in an orphanage","Revolutionized women's fashion by introducing trousers","Created a legendary perfume called No. 5","Popularized the little black dress","Founder of one of the world's most famous fashion houses"]},
  {name:"Ludwig van Beethoven", clues:["Born in Bonn, Germany in 1770","Moved to Vienna to study under Haydn","Began losing his hearing in his late twenties","Composed nine symphonies","Wrote the Moonlight Sonata and Fur Elise","Composed his Ninth Symphony while completely deaf"]},
  {name:"Galileo Galilei", clues:["Born in Pisa, Italy in 1564","Studied medicine before switching to mathematics","Improved the design of the telescope","Discovered four moons orbiting Jupiter","Was tried by the Roman Inquisition for heresy","Called the father of modern observational astronomy"]},
  {name:"Florence Nightingale", clues:["Born in Florence, Italy in 1820","Defied her wealthy family to pursue nursing","Worked during the Crimean War","Known as the Lady with the Lamp","Pioneered the use of statistics in healthcare","Founder of modern nursing"]},
  {name:"Vincent van Gogh", clues:["Born in the Netherlands in 1853","Worked as an art dealer and a preacher before painting","Only sold one painting during his lifetime","Famously cut off part of his own ear","Painted over 2,000 works in just over a decade","Created The Starry Night"]},
  {name:"Julius Caesar", clues:["Born into a patrician family in Rome around 100 BC","Conquered Gaul over eight years of campaigning","Crossed the Rubicon river in 49 BC","Became dictator perpetuo of Rome","Was assassinated on the Ides of March","The month of July is named after him"]},
  {name:"Mother Teresa", clues:["Born Agnes Gonxha Bojaxhiu in 1910 in Skopje","Joined the Sisters of Loreto at age 18","Moved to Calcutta and worked among the poorest","Founded the Missionaries of Charity in 1950","Won the Nobel Peace Prize in 1979","Canonized as a saint by the Catholic Church in 2016"]},
  {name:"Thomas Edison", clues:["Born in Milan, Ohio in 1847","Was partially deaf from childhood","Held 1,093 US patents","Established the first industrial research laboratory","Invented the phonograph and the motion picture camera","Credited with inventing the practical incandescent light bulb"]},
  {name:"Tutankhamun", clues:["Became pharaoh at approximately age nine","Ruled Egypt during the 18th Dynasty","Died around age 19 under mysterious circumstances","His tomb was discovered in the Valley of the Kings in 1922","Howard Carter spent years searching for his burial site","Known as King Tut, the boy pharaoh"]},
  {name:"Oprah Winfrey", clues:["Born in rural Mississippi in 1954","Started in local radio while still in high school","Moved to Chicago to host a morning talk show","Built a media empire including a magazine and TV network","Became North America's first Black multi-billionaire","Hosted the highest-rated talk show in television history"]},
  {name:"Marco Polo", clues:["Born in Venice, Italy around 1254","Traveled the Silk Road with his father and uncle","Spent 17 years in the court of a Mongol ruler","Returned to Venice with a fortune in gems","Dictated his travel memoirs while in a Genoese prison","His book inspired European exploration of Asia"]},
  {name:"Sigmund Freud", clues:["Born in Freiberg, Moravia in 1856","Studied at the University of Vienna","Developed the technique of free association","Proposed that the mind has conscious and unconscious parts","Wrote The Interpretation of Dreams","Considered the father of psychoanalysis"]},
  {name:"Bruce Lee", clues:["Born in San Francisco in 1940 but raised in Hong Kong","Studied philosophy at the University of Washington","Created his own martial arts style called Jeet Kune Do","Appeared in the TV series The Green Hornet","Died mysteriously at age 32","The most iconic martial artist in film history"]},
  {name:"Jane Austen", clues:["Born in Steventon, England in 1775","Never married despite receiving at least one proposal","Published her novels anonymously during her lifetime","Wrote about the British landed gentry","Created characters like Elizabeth Bennet and Mr. Darcy","Author of Pride and Prejudice and Sense and Sensibility"]},
  {name:"Neil Armstrong", clues:["Born in Wapakoneta, Ohio in 1930","Was a naval aviator during the Korean War","Worked as a test pilot for NASA's predecessor NACA","Commanded the Gemini 8 mission","Landed on the lunar surface on July 20, 1969","First person to walk on the Moon"]},
  {name:"Confucius", clues:["Born in the state of Lu around 551 BC","Worked as a bookkeeper and a caretaker of horses","Traveled across China for 14 years seeking an advisory role","Emphasized the importance of education and morality","His teachings were compiled by students into the Analects","The most influential philosopher in Chinese history"]},
  {name:"Walt Disney", clues:["Born in Chicago, Illinois in 1901","Was fired from a newspaper for lacking imagination","Created a cartoon character named Oswald the Lucky Rabbit","Won 22 Academy Awards in his lifetime","Opened a revolutionary theme park in Anaheim in 1955","Created Mickey Mouse and built a global entertainment empire"]},
  // ---- Additional entries (41-160) ----
  {name:"Archimedes", clues:["Born in Syracuse, Sicily around 287 BC","Studied in Alexandria, Egypt","Designed war machines to defend his city from Roman invasion","Discovered the principle of buoyancy while bathing","Reportedly shouted Eureka after his discovery","Considered the greatest mathematician of antiquity"]},
  {name:"Michelangelo", clues:["Born in Caprese, Italy in 1475","Apprenticed to the painter Ghirlandaio as a teenager","Sculpted a famous Pieta at age 24","Painted while lying on scaffolding for four years","Created the statue of David in Florence","Painted the ceiling of the Sistine Chapel"]},
  {name:"Aristotle", clues:["Born in Stagira, Greece in 384 BC","Studied at Plato's Academy for twenty years","Founded his own school called the Lyceum","Wrote on subjects from logic to biology to ethics","Tutored a young prince who would conquer an empire","One of the three pillars of Western philosophy"]},
  {name:"Catherine the Great", clues:["Born Princess Sophie of Anhalt-Zerbst in 1729","Moved to Russia at age 14 to marry the heir to the throne","Overthrew her own husband in a coup","Expanded her empire to the Black Sea coast","Was an avid art collector who founded the Hermitage Museum","Longest-ruling female leader of Russia"]},
  {name:"Rembrandt", clues:["Born in Leiden, Netherlands in 1606","Was one of the most successful artists of the Dutch Golden Age","Created nearly 100 self-portraits over his career","Filed for bankruptcy despite his fame","His most famous group portrait features a militia company","Painted The Night Watch"]},
  {name:"Pythagoras", clues:["Born on the island of Samos around 570 BC","Traveled to Egypt and Babylon to study mathematics","Founded a secretive philosophical community in southern Italy","Believed that numbers were the fundamental reality of the universe","His followers were forbidden from eating beans","His famous theorem relates the sides of a right triangle"]},
  {name:"Marie Antoinette", clues:["Born an Austrian archduchess in 1755","Married the French heir at age 14","Was known for extravagant spending at Versailles","Became deeply unpopular with the French people","Was falsely attributed the phrase Let them eat cake","Queen of France who was executed during the Revolution"]},
  {name:"Plato", clues:["Born in Athens around 428 BC","Was a student of Socrates","Wrote philosophical dialogues featuring his teacher","Founded a school of learning called the Academy","Proposed the theory of ideal Forms","One of the most influential philosophers in Western history"]},
  {name:"Hernando Cortes", clues:["Born in Medellin, Spain in 1485","Sailed to the New World at age 19","Formed alliances with peoples opposed to the ruling empire","Arrived at the capital of Tenochtitlan in 1519","Was initially mistaken for a returning deity","Spanish conquistador who conquered the Aztec Empire"]},
  {name:"Sitting Bull", clues:["Born around 1831 in present-day South Dakota","Was a holy man and leader of the Hunkpapa Lakota","United several Sioux tribes against encroachment","His forces defeated the US Cavalry in Montana in 1876","Briefly joined Buffalo Bill's Wild West show","Led the victory at the Battle of the Little Bighorn"]},
  {name:"Empress Wu Zetian", clues:["Born in 624 during the Tang Dynasty","Entered the imperial court as a concubine at age 14","Rose through political maneuvering to become empress consort","Established a secret police and merit-based civil service","Ruled for over four decades in total","The only woman to rule China as emperor in her own right"]},
  {name:"Johannes Gutenberg", clues:["Born in Mainz, Germany around 1400","Was trained as a goldsmith","Experimented with oil-based inks and metal alloys","Borrowed money from Johann Fust to fund his project","Lost a lawsuit and his workshop to his financier","Invented the movable-type printing press in Europe"]},
  {name:"Nefertiti", clues:["Lived during the 14th century BC in Egypt","Her name means the beautiful one has come","Was the Great Royal Wife of a pharaoh who changed religion","Helped transform Egyptian worship to a single sun god","Her painted limestone bust is one of the most famous artworks","Queen of Egypt and wife of Akhenaten"]},
  {name:"Charlie Chaplin", clues:["Born in London in 1889 to music hall performers","Grew up in extreme poverty and spent time in a workhouse","Moved to America with a vaudeville troupe","Co-founded United Artists studio in 1919","Was investigated and exiled during the Red Scare","Created the iconic Little Tramp character in silent films"]},
  {name:"Che Guevara", clues:["Born in Rosario, Argentina in 1928","Trained as a medical doctor","Traveled across South America by motorcycle as a young man","Met Fidel Castro in Mexico City in 1955","Served as president of the National Bank of Cuba","Argentine revolutionary whose image became a global icon"]},
  {name:"Hatshepsut", clues:["Lived in the 15th century BC","Became regent for her young stepson","Declared herself pharaoh and wore the traditional false beard","Expanded trade expeditions to the Land of Punt","Built a magnificent mortuary temple at Deir el-Bahri","One of the most successful female pharaohs of ancient Egypt"]},
  {name:"Alfred Hitchcock", clues:["Born in Leytonstone, England in 1899","Began his career making silent films in London","Made cameo appearances in most of his own films","Created a famous TV anthology series","Directed Rear Window, Vertigo, and North by Northwest","Known as the Master of Suspense"]},
  {name:"Socrates", clues:["Born in Athens around 470 BC","Was a stonemason by trade before turning to philosophy","Never wrote down any of his teachings","Developed the method of questioning to arrive at truth","Was sentenced to death for corrupting the youth of Athens","The foundational philosopher of the Western tradition"]},
  {name:"Pocahontas", clues:["Born around 1596 in present-day Virginia","Was the daughter of the paramount chief Powhatan","Reportedly intervened to save a captured colonist's life","Was captured by English settlers and held for ransom","Married tobacco planter John Rolfe","A Native American woman who traveled to England and met the King"]},
  {name:"Mansa Musa", clues:["Ruled an empire in West Africa in the early 1300s","His kingdom was the largest producer of gold in the world","Made a legendary pilgrimage east in 1324","His generous spending destabilized gold prices for a decade","Built the famous Djinguereber Mosque in Timbuktu","Considered the wealthiest person in history"]},
  {name:"Louis Pasteur", clues:["Born in Dole, France in 1822","Was a professor of chemistry at the University of Lille","Disproved the theory of spontaneous generation","Saved the French silk industry by identifying a parasite","Developed a vaccine for rabies in 1885","Invented the process of heating liquids to kill germs"]},
  {name:"Marilyn Monroe", clues:["Born Norma Jeane Mortenson in Los Angeles in 1926","Spent much of her childhood in foster homes","Was discovered while working in a munitions factory","Studied at the Actors Studio in New York","Sang a famous birthday tribute to President Kennedy","One of the most iconic movie stars of the 1950s"]},
  {name:"Sun Tzu", clues:["Lived in ancient China around the 5th century BC","Was a military general serving the King of Wu","His strategies helped a small state defeat a larger rival","His work has been studied by military leaders for centuries","His central idea is that war is won before the battle begins","Author of The Art of War"]},
  {name:"Alexander Graham Bell", clues:["Born in Edinburgh, Scotland in 1847","Both his mother and wife were deaf","Worked as a teacher of deaf students","Raced to the patent office against another inventor","His assistant Watson heard his voice through a wire","Invented the telephone"]},
  {name:"Joan of Arc", clues:["Born in Domremy, France around 1412","Was an illiterate peasant girl","Claimed to receive visions from saints at age 13","Led French troops to lift the siege of Orleans in 1429","Was captured by the Burgundians and sold to the English","Burned at the stake for heresy at age 19"]},
  {name:"Stephen Hawking", clues:["Born in Oxford, England in 1942","Diagnosed with motor neurone disease at age 21","Held the Lucasian Professorship at Cambridge","Proposed that black holes emit radiation","Communicated through a speech-generating device","Wrote A Brief History of Time"]},
  {name:"Carl Sagan", clues:["Born in Brooklyn, New York in 1934","Was fascinated by the stars from early childhood","Worked on NASA's Mariner and Voyager missions","Designed the Golden Record sent into interstellar space","Popularized the phrase billions and billions","Hosted the groundbreaking TV series Cosmos"]},
  {name:"Ramesses II", clues:["Born around 1303 BC in ancient Egypt","Became pharaoh at approximately age 25","Fought a famous battle against the Hittites at Kadesh","Built more monuments than any other Egyptian ruler","Fathered over 100 children","Known as Ramesses the Great, he ruled for 66 years"]},
  {name:"Copernicus", clues:["Born in Royal Prussia in 1473","Studied law, medicine, and astronomy in Italy","Worked as a canon in the Catholic Church","Spent decades developing his revolutionary model of the cosmos","His book was published just before his death in 1543","Proposed that the Earth revolves around the Sun"]},
  {name:"Mikhail Gorbachev", clues:["Born in Privolnoye, Russia in 1931","Rose through Communist Party ranks as a reformer","Introduced policies of openness and restructuring","Met with Reagan to reduce nuclear weapons","Won the Nobel Peace Prize in 1990","Last leader of the Soviet Union"]},
  {name:"Hannibal Barca", clues:["Born in Carthage around 247 BC","Swore eternal enmity against Rome as a child","Commanded an army that included war elephants","Crossed the Alps in winter to invade Italy","Won a devastating victory at the Battle of Cannae","Carthaginian general who nearly conquered Rome"]},
  {name:"Ernest Hemingway", clues:["Born in Oak Park, Illinois in 1899","Served as an ambulance driver in World War I","Lived as an expatriate in Paris in the 1920s","Was an avid deep-sea fisherman and big game hunter","Won the Nobel Prize in Literature in 1954","Author of The Old Man and the Sea and A Farewell to Arms"]},
  {name:"Elizabeth I", clues:["Born at Greenwich Palace in 1533","Her mother was executed when she was two years old","Was imprisoned in the Tower of London by her sister","Never married and was called the Virgin Queen","Defeated the Spanish Armada in 1588","Ruled England during its Golden Age for 45 years"]},
  {name:"Nikita Khrushchev", clues:["Born in a small Russian village in 1894","Rose through Communist Party ranks under Stalin","Denounced his predecessor's cult of personality in a secret speech","Banged his shoe on a desk at the United Nations","Faced off against Kennedy over missiles in the Caribbean","Soviet leader during the Cuban Missile Crisis"]},
  {name:"Fyodor Dostoevsky", clues:["Born in Moscow in 1821","Was sentenced to death but reprieved at the last moment","Spent four years in a Siberian prison camp","Struggled with gambling addiction throughout his life","Explored themes of morality, free will, and suffering","Author of Crime and Punishment and The Brothers Karamazov"]},
  {name:"Kublai Khan", clues:["Born in Mongolia in 1215","Was the grandson of the founder of the Mongol Empire","Conquered the Song Dynasty and unified China","Established a capital at what is now Beijing","Attempted two failed naval invasions of Japan","Founder of the Yuan Dynasty in China"]},
  {name:"Rosalind Franklin", clues:["Born in London in 1920","Studied physical chemistry at Cambridge","Became an expert in X-ray crystallography","Produced a crucial photograph known as Photo 51","Her work was used without her knowledge by rival researchers","Her X-ray images were key to discovering the structure of DNA"]},
  {name:"Akira Kurosawa", clues:["Born in Tokyo in 1910","Originally trained as a painter","Made his directorial debut in 1943","Adapted Shakespeare plays into Japanese settings","Influenced George Lucas and other Western filmmakers","Directed Seven Samurai and Rashomon"]},
  {name:"Simone de Beauvoir", clues:["Born in Paris in 1908","Studied philosophy at the Sorbonne","Had a lifelong partnership with Jean-Paul Sartre","Was a leading figure in existentialist philosophy","Argued that gender roles are socially constructed","Wrote The Second Sex, a foundational feminist text"]},
  {name:"Srinivasa Ramanujan", clues:["Born in Erode, India in 1887","Had almost no formal training in mathematics","Filled notebooks with thousands of original theorems","Wrote a letter to a Cambridge professor that changed his life","Collaborated with G.H. Hardy at Cambridge","One of the most brilliant self-taught mathematicians in history"]},
  {name:"Emiliano Zapata", clues:["Born in Anenecuilco, Mexico in 1879","Worked as a horse trainer before becoming a revolutionary","Fought for land reform and the rights of peasant farmers","His followers were known as Zapatistas","Was assassinated in an ambush in 1919","A key leader of the Mexican Revolution"]},
  {name:"Mary Shelley", clues:["Born in London in 1797","Her mother was a famous feminist writer","Eloped with a romantic poet at age 16","Conceived her most famous work during a ghost story competition","Published her novel anonymously at age 20","Author of Frankenstein"]},
  {name:"Shaka Zulu", clues:["Born around 1787 in present-day South Africa","Was rejected by his father's clan as a child","Revolutionized military tactics among his people","Introduced the short stabbing spear called the iklwa","Built the Zulu Kingdom into a major regional power","The most famous king of the Zulu nation"]},
  {name:"Alan Turing", clues:["Born in London in 1912","Studied mathematics at King's College, Cambridge","Worked at Bletchley Park during World War II","Designed a machine to crack the Enigma code","Proposed a test to measure machine intelligence","Father of theoretical computer science and artificial intelligence"]},
  {name:"Indira Gandhi", clues:["Born in Allahabad, India in 1917","Was the daughter of India's first prime minister","Studied at Oxford University","Declared a controversial state of emergency in 1975","Ordered a military operation at the Golden Temple","First and only female Prime Minister of India"]},
  {name:"Niels Bohr", clues:["Born in Copenhagen, Denmark in 1885","Played football at the university level","Proposed a new model of the atom in 1913","Won the Nobel Prize in Physics in 1922","Helped physicists escape Nazi-occupied Europe","Pioneer of quantum mechanics and the atomic model"]},
  {name:"Boudicca", clues:["Lived in 1st century AD Britain","Was queen of the Iceni tribe","Rebelled after her kingdom was seized by Rome","Her army destroyed the Roman colony of Camulodunum","Burned Londinium to the ground","The warrior queen who led a revolt against Roman Britain"]},
  {name:"Mustafa Kemal Ataturk", clues:["Born in Thessaloniki in 1881","Served as a military commander at Gallipoli","Led the Turkish War of Independence after World War I","Abolished the caliphate and the sultanate","Introduced the Latin alphabet and Western legal codes","Founder and first president of the Republic of Turkey"]},
  {name:"Rabindranath Tagore", clues:["Born in Calcutta, India in 1861","Was part of a prominent Bengali intellectual family","Wrote poetry, novels, plays, and over 2,000 songs","Established an experimental school at Santiniketan","Was the first non-European to win the Nobel Prize in Literature","Composed the national anthems of both India and Bangladesh"]},
  {name:"Wernher von Braun", clues:["Born in Germany in 1912","Was fascinated by rocketry from childhood","Developed rockets for the German military during World War II","Surrendered to American forces in 1945","Became a leading figure at NASA","Chief architect of the Saturn V rocket that sent humans to the Moon"]},
  {name:"Sacagawea", clues:["Born around 1788 in present-day Idaho","Was kidnapped by a rival tribe as a child","Married French-Canadian fur trader Toussaint Charbonneau","Carried her infant son on the journey","Served as interpreter and guide across unfamiliar territory","Guided the Lewis and Clark Expedition to the Pacific"]},
  {name:"Nikola Gogol", clues:["Born in Ukraine in 1809","Moved to St. Petersburg to pursue a literary career","Wrote satirical stories about Russian provincial life","His comedy lampooned corrupt government officials","Burned the manuscript of his unfinished sequel","Author of Dead Souls and The Inspector General"]},
  {name:"Hypatia", clues:["Born in Alexandria, Egypt around 360 AD","Her father was a prominent mathematician","Was one of the leading scholars at the Library of Alexandria","Taught philosophy, astronomy, and mathematics","Was murdered by a Christian mob in 415 AD","One of the first notable women in mathematics"]},
  {name:"Simone Biles", clues:["Born in Columbus, Ohio in 1997","Was placed in foster care as a young child","Began gymnastics at age six during a field trip","Has won more World Championship medals than any gymnast","Has four original skills named after her","Most decorated gymnast in history"]},
  {name:"Miyamoto Musashi", clues:["Born in Japan around 1584","Fought his first duel at age 13","Was undefeated in over 60 duels","Developed a two-sword fighting style","Became a painter and calligrapher in later life","Legendary Japanese swordsman who wrote The Book of Five Rings"]},
  {name:"Pelé", clues:["Born Edson Arantes do Nascimento in Brazil in 1940","Grew up in poverty and made balls from socks stuffed with paper","Scored his first professional goal at age 15","Played in four World Cup tournaments","Scored over 1,000 career goals","Widely regarded as the greatest football player of all time"]},
  {name:"Mary Wollstonecraft", clues:["Born in London in 1759","Worked as a governess and school teacher","Traveled to revolutionary France during the Reign of Terror","Argued for equal education for women and men","Died shortly after giving birth to her second daughter","Wrote A Vindication of the Rights of Woman"]},
  {name:"Tchaikovsky", clues:["Born in Votkinsk, Russia in 1840","Studied law before pursuing music","His first symphony was called Winter Daydreams","Composed famous ballet scores throughout his career","His 1812 Overture uses real cannon fire","Composed Swan Lake, The Nutcracker, and Sleeping Beauty"]},
  {name:"Saladin", clues:["Born in Tikrit, Mesopotamia around 1137","Was of Kurdish origin","United Egypt and Syria under his rule","Was known for chivalry even by his Christian enemies","Recaptured Jerusalem from the Crusaders in 1187","The Muslim leader who fought Richard the Lionheart"]},
  {name:"Harriet Beecher Stowe", clues:["Born in Litchfield, Connecticut in 1811","Came from a prominent family of preachers","Was inspired by the Fugitive Slave Act of 1850","Her novel became the best-selling book of the 19th century","Lincoln reportedly credited her with starting the war","Author of Uncle Tom's Cabin"]},
  {name:"Hirohito", clues:["Born in Tokyo in 1901","Was the 124th emperor of his dynasty","Studied marine biology as a lifelong passion","Oversaw his nation's expansion during the 1930s and 1940s","Broadcast the surrender announcement to his people in 1945","Emperor of Japan during World War II"]},
  {name:"Grace Hopper", clues:["Born in New York City in 1906","Was a mathematics professor at Vassar College","Joined the US Navy during World War II","Found a moth in a computer and popularized the term debugging","Developed the first compiler for a computer language","Pioneering computer scientist known as Amazing Grace"]},
  {name:"Ibn Battuta", clues:["Born in Tangier, Morocco in 1304","Left home at age 21 on a pilgrimage","Traveled approximately 75,000 miles over 29 years","Visited nearly every Muslim-ruled territory of his time","Served as a judge in Delhi and the Maldives","History's greatest pre-modern traveler"]},
  {name:"Lise Meitner", clues:["Born in Vienna in 1878","Was one of the first women to earn a physics doctorate in Austria","Worked with Otto Hahn in Berlin for thirty years","Fled Nazi Germany in 1938 due to her Jewish heritage","Correctly explained the process of splitting atoms","Physicist whose work led to the discovery of nuclear fission"]},
  {name:"Toussaint Louverture", clues:["Born into slavery in Saint-Domingue around 1743","Was self-educated and read widely","Rose to lead the largest slave revolt in history","Defeated French, Spanish, and British armies","Was captured by Napoleon's forces and died in prison","Leader of the Haitian Revolution"]},
  {name:"Enrico Fermi", clues:["Born in Rome, Italy in 1901","Won the Nobel Prize in Physics in 1938","Emigrated to the United States to escape fascist Italy","Worked on the Manhattan Project at the University of Chicago","Built the first nuclear reactor in a squash court","Known as the architect of the nuclear age"]},
  {name:"Billie Holiday", clues:["Born Eleanora Fagan in Philadelphia in 1915","Had a difficult childhood and dropped out of school","Began singing in Harlem nightclubs as a teenager","Was known for wearing gardenias in her hair","Her song Strange Fruit confronted racial violence","One of the greatest jazz vocalists in history"]},
  {name:"James Cook", clues:["Born in Marton, England in 1728","Rose from a farm laborer's son to a Royal Navy captain","Mapped the coastline of Newfoundland with great precision","Made three voyages across the Pacific Ocean","Was the first European to reach the east coast of Australia","The explorer who charted New Zealand and Hawaii"]},
  {name:"Benazir Bhutto", clues:["Born in Karachi, Pakistan in 1953","Studied at Harvard and Oxford","Her father was a former prime minister who was executed","Was the first woman to lead a Muslim-majority nation","Served two terms as prime minister","Assassinated while campaigning in 2007"]},
  {name:"Johannes Kepler", clues:["Born in Weil der Stadt, Germany in 1571","Studied theology before turning to astronomy","Worked as an assistant to Tycho Brahe in Prague","Suffered personal tragedy including the death of his first wife","Published the Astronomia Nova in 1609","Discovered that planets orbit the Sun in ellipses"]},
  {name:"Rasputin", clues:["Born in a Siberian village in 1869","Was a self-proclaimed holy man and mystic","Gained influence at the Russian imperial court","Claimed to ease the suffering of the heir to the throne","Survived multiple assassination attempts in one night","The infamous advisor to Tsar Nicholas II and Tsarina Alexandra"]},
  {name:"Wangari Maathai", clues:["Born in Nyeri, Kenya in 1940","Was the first woman in East Africa to earn a doctorate","Founded a movement that planted over 30 million trees","Campaigned for democracy and human rights in Kenya","Won the Nobel Peace Prize in 2004","Kenyan environmentalist who started the Green Belt Movement"]},
  {name:"Michael Faraday", clues:["Born in London in 1791 to a poor family","Was largely self-taught in science","Worked as a bookbinder's apprentice as a youth","Discovered electromagnetic induction","Invented an early form of the electric motor","One of the most influential experimental physicists in history"]},
  {name:"Montezuma II", clues:["Became ruler of a vast Mesoamerican empire around 1502","His capital city was built on an island in a lake","Presided over elaborate religious ceremonies","Received reports of strange visitors arriving from the east","Was taken captive in his own palace","Last independent Aztec emperor before the Spanish conquest"]},
  {name:"Rachel Carson", clues:["Born in Springdale, Pennsylvania in 1907","Was a marine biologist with the US Fish and Wildlife Service","Wrote eloquently about the sea and coastal ecosystems","Investigated the harmful effects of synthetic pesticides","Faced fierce opposition from the chemical industry","Author of Silent Spring, which launched the environmental movement"]},
  {name:"Charlemagne", clues:["Born in 742 in the Frankish kingdom","United much of Western Europe through military campaigns","Was a patron of education and learning","Established schools and promoted literacy across his realm","Was crowned by the Pope on Christmas Day, 800 AD","Known as the Father of Europe"]},
  {name:"Bob Marley", clues:["Born in Nine Mile, Jamaica in 1945","Was of mixed Jamaican and English parentage","Formed a band called the Wailers as a teenager","Survived an assassination attempt in 1976","His music blended themes of love, resistance, and spirituality","The most famous reggae musician in history"]},
  {name:"Ferdinand Magellan", clues:["Born in Portugal around 1480","Sailed under the Spanish flag after a dispute with his king","Set out in 1519 with five ships and 270 men","Navigated through a treacherous strait at South America's tip","Was killed in a battle in the Philippines","Led the first expedition to circumnavigate the Earth"]},
  {name:"Ching Shih", clues:["Born in Guangdong, China around 1775","Worked on a floating brothel before her rise to power","Married a notorious pirate captain","Took command of the fleet after her husband died","Commanded up to 80,000 pirates at her peak","The most powerful pirate in history"]},
  {name:"Gregor Mendel", clues:["Born in Moravia in 1822","Joined an Augustinian monastery as a young man","Studied mathematics and science at the University of Vienna","Conducted experiments with thousands of pea plants","His work was ignored for decades before being rediscovered","Father of genetics"]},
  {name:"Yuri Gagarin", clues:["Born in Klushino, Russia in 1934","Trained as a foundry worker before joining the air force","Was selected from over 3,000 candidates for a special program","Orbited the Earth on April 12, 1961","His flight lasted 108 minutes","The first human being in space"]},
  {name:"Emmeline Pankhurst", clues:["Born in Manchester, England in 1858","Founded the Women's Social and Political Union in 1903","Used militant tactics including hunger strikes","Was arrested multiple times for civil disobedience","Her daughters Christabel and Sylvia also became activists","Leader of the British suffragette movement"]},
  {name:"Blaise Pascal", clues:["Born in Clermont-Ferrand, France in 1623","Was a child prodigy in mathematics","Invented a mechanical calculator at age 19","Conducted experiments on atmospheric pressure and vacuums","Had a profound religious experience that changed his life","Mathematician and philosopher who wrote the Pensees"]},
  {name:"Frederick Douglass", clues:["Born into slavery in Maryland around 1818","Taught himself to read and write in secret","Escaped to freedom by disguising himself as a sailor","Became a powerful orator against slavery","Advised President Lincoln during the Civil War","The most prominent African American abolitionist of the 19th century"]},
  {name:"James Watt", clues:["Born in Greenock, Scotland in 1736","Worked as an instrument maker at the University of Glasgow","Was asked to repair a Newcomen engine model","Invented the separate condenser to improve efficiency","His improvements powered the Industrial Revolution","The unit of power is named after him"]},
  {name:"Malala Yousafzai", clues:["Born in Mingora, Pakistan in 1997","Began writing a blog about life under Taliban rule at age 11","Was shot by Taliban gunmen on her school bus in 2012","Survived and continued her advocacy from the UK","Became the youngest-ever Nobel Peace Prize laureate","Activist for girls' education around the world"]},
  {name:"Dmitri Mendeleev", clues:["Born in Tobolsk, Siberia in 1834","Was the youngest of at least 14 siblings","Studied chemistry in St. Petersburg and Heidelberg","Arranged the known elements by atomic weight","Predicted the existence of elements not yet discovered","Creator of the periodic table"]},
  {name:"Nefertari", clues:["Lived in Egypt during the 13th century BC","Was the principal wife of a powerful warrior pharaoh","Her name means beautiful companion","Was highly educated and could read and write hieroglyphics","Her tomb in the Valley of the Queens is renowned for its paintings","Great Royal Wife of Ramesses II"]},
  {name:"Voltaire", clues:["Born Francois-Marie Arouet in Paris in 1694","Was imprisoned in the Bastille twice","Lived in exile in England for three years","Was a prolific writer of plays, essays, and satires","Championed freedom of speech and separation of church and state","The leading philosopher of the French Enlightenment"]},
  {name:"Edmund Hillary", clues:["Born in Auckland, New Zealand in 1919","Worked as a beekeeper before his famous exploits","Served in the Royal New Zealand Air Force in World War II","Led expeditions to both polar regions later in life","Reached the summit on May 29, 1953","First confirmed person to reach the top of Mount Everest"]},
  {name:"Hedy Lamarr", clues:["Born Hedwig Kiesler in Vienna in 1914","Became a Hollywood movie star in the 1930s and 1940s","Was married six times","Co-invented a frequency-hopping communication system","Her invention was initially ignored by the Navy","Movie star and inventor whose technology led to modern WiFi and Bluetooth"]},
  {name:"Tokugawa Ieyasu", clues:["Born in Mikawa Province, Japan in 1543","Spent his childhood as a hostage of rival clans","Patiently waited decades for his chance to seize power","Won a decisive battle at Sekigahara in 1600","Established a government in Edo, modern-day Tokyo","Founder of the Tokugawa shogunate that ruled Japan for 260 years"]},
  {name:"Dorothy Hodgkin", clues:["Born in Cairo in 1910","Studied chemistry at Oxford University","Pioneered the use of X-ray crystallography on biological molecules","Determined the structure of penicillin during World War II","Won the Nobel Prize in Chemistry in 1964","Discovered the three-dimensional structure of insulin and vitamin B12"]},
  {name:"Simon Bolivar", clues:["Born in Caracas, Venezuela in 1783","Was educated in Europe and influenced by Enlightenment ideas","Swore an oath on a Roman hill to liberate his homeland","Led military campaigns across multiple South American countries","Bolivia is named in his honor","Known as El Libertador for freeing South America from Spanish rule"]},
  {name:"Wilbur and Orville Wright", clues:["Brothers from Dayton, Ohio","Ran a bicycle repair and sales shop","Built a wind tunnel to test wing designs","Traveled to the Outer Banks of North Carolina for their experiments","Their first successful flight lasted just 12 seconds","Made the first powered airplane flight at Kitty Hawk in 1903"]},
  {name:"Murasaki Shikibu", clues:["Lived in Japan around 978 to 1014 AD","Was a lady-in-waiting at the imperial court","Wrote in the Heian period during a golden age of Japanese culture","Her work explores court life, love, and political intrigue","It is often called the world's first novel","Author of The Tale of Genji"]},
  {name:"Usain Bolt", clues:["Born in Sherwood Content, Jamaica in 1986","Originally wanted to be a fast bowler in cricket","Won his first international medal at age 15","Set the 100m world record at 9.58 seconds","Won gold in three consecutive Olympic Games","The fastest person ever timed"]},
  {name:"Max Planck", clues:["Born in Kiel, Germany in 1858","Was told by a professor not to go into physics","Studied thermodynamics and blackbody radiation","Introduced the concept of energy quanta in 1900","Won the Nobel Prize in Physics in 1918","Father of quantum theory"]},
  {name:"Sojourner Truth", clues:["Born into slavery in New York around 1797","Escaped to freedom with her infant daughter in 1826","Successfully sued for her son's return from slavery","Became a traveling preacher and abolitionist","Delivered a powerful speech at a women's rights convention in Ohio","Freed woman whose famous question was Ain't I a Woman"]},
  {name:"Isambard Kingdom Brunel", clues:["Born in Portsmouth, England in 1806","His father was also a famous engineer","Nearly drowned during the construction of a tunnel under the Thames","Designed the Great Western Railway","Built three revolutionary steamships, each the largest of its time","Voted the second greatest Briton after Winston Churchill"]},
  {name:"Pancho Villa", clues:["Born Jose Doroteo Arango in Durango, Mexico in 1878","Became an outlaw as a teenager","Led a powerful cavalry force in northern Mexico","Raided Columbus, New Mexico in 1916","The US sent an expedition to capture him but failed","One of the most famous generals of the Mexican Revolution"]},
  {name:"Niccolo Machiavelli", clues:["Born in Florence, Italy in 1469","Served as a diplomat for the Florentine Republic","Was imprisoned and tortured after the Medici returned to power","Wrote his most famous work while in exile","Argued that rulers must sometimes use cunning and force","Author of The Prince"]},
  {name:"Mark Twain", clues:["Born Samuel Clemens in Florida, Missouri in 1835","Worked as a steamboat pilot on the Mississippi River","Took his pen name from a river depth measurement","Traveled widely and wrote humorous travel accounts","Created beloved characters like Tom Sawyer","Author of Adventures of Huckleberry Finn"]},
  {name:"Suleiman the Magnificent", clues:["Born in Trabzon in 1494","Became sultan at age 26","Expanded his empire to the gates of Vienna","Was a noted poet who wrote under a pen name","Reformed the legal system of his empire","The longest-reigning sultan of the Ottoman Empire"]},
  {name:"Tu Youyou", clues:["Born in Ningbo, China in 1930","Studied pharmacy and traditional Chinese medicine","Was recruited for a secret military research project in 1969","Searched ancient texts for clues to fighting a tropical disease","Tested her discovery on herself before clinical trials","Won the Nobel Prize for discovering artemisinin to treat malaria"]},
  {name:"Roald Amundsen", clues:["Born near Oslo, Norway in 1872","Was the first to navigate the Northwest Passage","Meticulously planned every detail of his expeditions","Used sled dogs instead of ponies or motors","Beat a British rival by about five weeks","First person to reach the South Pole in 1911"]},
  {name:"Frédéric Chopin", clues:["Born near Warsaw, Poland in 1810","Was a child prodigy who gave his first concert at age 7","Left Poland at 20 and never returned","Lived in Paris and had a relationship with writer George Sand","Suffered from tuberculosis for most of his adult life","One of the greatest piano composers in history"]},
  {name:"Zheng He", clues:["Born in Yunnan, China around 1371","Was captured as a boy and became a court eunuch","Rose to become a trusted advisor to the Yongle Emperor","Commanded a fleet of enormous treasure ships","Made seven voyages across the Indian Ocean","China's greatest maritime explorer of the Ming Dynasty"]},
  {name:"Harriet Quimby", clues:["Born in Michigan around 1875","Was one of the first female journalists in the US","Wrote screenplays for early silent films","Earned her pilot's license in 1911","Flew across the English Channel in 1912","The first American woman to earn a pilot's license"]},
  {name:"J. Robert Oppenheimer", clues:["Born in New York City in 1904","Studied physics at Harvard, Cambridge, and Gottingen","Was appointed director of a secret laboratory in New Mexico","Oversaw the Trinity test in July 1945","Quoted Hindu scripture after witnessing the explosion","Led the development of the atomic bomb"]},
  {name:"Josephine Baker", clues:["Born in St. Louis, Missouri in 1906","Moved to Paris and became a sensation in French music halls","Was known for her daring and exotic dance performances","Worked as a spy for the French Resistance in World War II","Adopted twelve children from around the world","The first African American woman to star in a major motion picture"]},
];

/* ---- Normalize for comparison ---- */
function normalize(str) {
  return str.toLowerCase().replace(/[^a-z0-9]/g, "");
}

/* ---- Share ---- */
function buildShareText(puzzleNo, history, solved, guessesUsed) {
  const emojis = history.map(h => h.correct ? "🟩" : "🟥").join("");
  const score = solved ? `${guessesUsed}/${MAX_GUESSES}` : `X/${MAX_GUESSES}`;
  return `Whodunit #${puzzleNo} 🔍\n${emojis}\n${score}\nhttps://daily-le.com/whodunit/`;
}

/* ---- Main ---- */
(function main() {
  const today = todayLocalISO();
  const puzzleNo = gameNumberFromDate(today);
  setText("dayPill", `#${puzzleNo} — ${today}`);

  const chosen = pickFromBag(PEOPLE, "whodunit", today);

  let guesses = 0;
  let solved = false;
  const history = [];

  function showClue(n) {
    setText("clueText", chosen.clues[n]);
    setText("triesPill", `Clue: ${n + 1}/${MAX_GUESSES}`);
  }

  // Already played
  if (localStorage.getItem(DAILY_DONE_KEY) === today) {
    $("guessInput").disabled = true;
    $("guessBtn").disabled = true;
    showClue(MAX_GUESSES - 1);
    setText("endTitle", "Already played today ✅");
    setText("endBody", `The answer was ${chosen.name}.`);
    $("shareBtn").disabled = false;
    $("shareTopBtn").disabled = false;
    showModal();
    return;
  }

  showClue(0);

  function endGame(win) {
    solved = win;
    $("guessInput").disabled = true;
    $("guessBtn").disabled = true;
    localStorage.setItem(DAILY_DONE_KEY, today);

    setText("endTitle", win ? "You got it! ✅" : "Not this time ❌");
    setText("endBody", `The answer was ${chosen.name}.`);

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

  $("guessForm").addEventListener("submit", function(e) {
    e.preventDefault();
    setText("errorLine", "");
    if (solved) return;

    const input = $("guessInput");
    const guess = input.value.trim();
    input.value = "";

    if (!guess) {
      setText("errorLine", "Type a name to guess.");
      return;
    }

    guesses++;
    const correct = normalize(guess) === normalize(chosen.name);
    history.push({ name: guess, correct: correct });

    // History row
    const histEl = $("history");
    const row = document.createElement("div");
    row.className = "history-row";
    row.innerHTML =
      '<span class="emoji">' + (correct ? "🟩" : "🟥") + '</span>' +
      '<span class="name">' + guess + '</span>' +
      '<span class="tag ' + (correct ? "good" : "bad") + '">' + (correct ? "Correct!" : "Wrong") + '</span>';
    histEl.prepend(row);

    if (correct) { endGame(true); return; }

    if (guesses >= MAX_GUESSES) { endGame(false); return; }

    // Show next clue
    showClue(guesses);
    $("guessInput").focus();
  });

  // Share
  function currentShareText() {
    return buildShareText(puzzleNo, history, solved, guesses);
  }
  if ($("shareBtn")) $("shareBtn").addEventListener("click", function() { shareNice("Whodunit", currentShareText(), "https://daily-le.com/whodunit/"); });
  if ($("shareTopBtn")) $("shareTopBtn").addEventListener("click", function() { shareNice("Whodunit", currentShareText(), "https://daily-le.com/whodunit/"); });

  if ($("closeStatsBtn")) $("closeStatsBtn").addEventListener("click", hideModal);
  if ($("statsBackdrop")) $("statsBackdrop").addEventListener("click", hideModal);
})();
