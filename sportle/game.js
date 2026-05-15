const ROUNDS = 4;
const DAILY_DONE_KEY = "sportle_daily_done_v1";

/* ---- Data: 150+ sports with descriptions ---- */
const SPORTS = [
  // ---- Ball Sports ----
  {name:"Cricket", description:"Two teams of 11 take turns batting and fielding on an oval pitch. The batting side tries to score runs by hitting a ball bowled at them and running between two sets of stumps, while the bowling side tries to dismiss batters by hitting the wicket or catching the ball."},
  {name:"Baseball", description:"Two teams of nine alternate between batting and fielding over nine innings. The batter tries to hit a pitched ball and run around four bases to score a run. Three outs retire the batting side."},
  {name:"Softball", description:"Similar to baseball but played with a larger ball on a smaller diamond. The pitcher throws underhand from a flat circle rather than an elevated mound. Games are seven innings."},
  {name:"Soccer", description:"Two teams of 11 try to kick a ball into the opposing team's goal on a large grass pitch. Outfield players cannot use their hands or arms. Matches consist of two 45-minute halves."},
  {name:"Basketball", description:"Two teams of five try to score by throwing a ball through an elevated hoop with a net. Players advance the ball by dribbling or passing. A shot from beyond the arc is worth three points, inside is worth two."},
  {name:"Tennis", description:"Two or four players hit a felt-covered ball over a net on a rectangular court. The ball may bounce once before being returned. Scoring progresses through points, games, and sets."},
  {name:"Volleyball", description:"Two teams of six are separated by a high net. Teams hit a ball over the net using no more than three contacts per side. Points are scored when the ball lands on the opposing team's court or they commit a fault."},
  {name:"Rugby", description:"Two teams of 15 carry, pass, and kick an oval ball to score tries by grounding it in the opposing team's in-goal area. Forward passing is not allowed. Players tackle opponents to stop their advance."},
  {name:"Badminton", description:"Players use lightweight rackets to hit a feathered shuttlecock over a high net. The shuttlecock must not touch the ground, and points are scored when the opponent fails to return it. Matches are best of three games to 21 points."},
  {name:"Table Tennis", description:"Players use small paddles to hit a lightweight ball back and forth across a net on a hard table. The ball must bounce once on each side. Games are played to 11 points with a two-point lead required."},
  {name:"Squash", description:"Two players take turns hitting a small rubber ball against the front wall of an enclosed court. The ball may only bounce once on the floor before being returned. Players share the same court space."},
  {name:"Handball", description:"Two teams of seven players throw a ball into the opposing team's goal on an indoor court. Players can take three steps while holding the ball and must pass or shoot within three seconds. The goalkeeper is the only player who can use their feet."},
  {name:"Golf", description:"Players use various clubs to hit a small ball into a series of holes on a large outdoor course in as few strokes as possible. A standard course has 18 holes with varying distances and hazards like bunkers and water."},
  {name:"Lacrosse", description:"Players use a long stick with a mesh pocket at the end to carry, catch, and throw a rubber ball. The objective is to shoot the ball into the opposing team's goal. It originated among Indigenous peoples of North America."},
  {name:"Field Hockey", description:"Two teams of 11 use curved sticks to hit a small hard ball along the ground into the opposing team's goal. The ball may only be played with the flat side of the stick. Games are played on turf."},
  {name:"American Football", description:"Two teams of 11 try to advance an oval ball down a 100-yard field by running or passing it. The offense has four attempts to move 10 yards. A touchdown in the end zone scores six points."},
  {name:"Pickleball", description:"Players use solid paddles to hit a perforated polymer ball over a low net on a court roughly the size of a badminton court. Serving is underhand, and there is a non-volley zone near the net called the kitchen."},
  {name:"Racquetball", description:"Players use a short-handled racquet to hit a hollow rubber ball against the walls of an enclosed court. The ball can bounce off any wall, but must hit the front wall on the fly before the second bounce."},
  {name:"Netball", description:"Two teams of seven pass a ball to score goals by shooting through a ring at the top of a pole. Players cannot run with the ball and must pass within three seconds. Each player is restricted to certain areas of the court."},
  {name:"Padel", description:"A racquet sport played in pairs on an enclosed court about a third the size of a tennis court. The ball can be played off the glass walls, similar to squash. Underhand serving is required."},

  // ---- Water Sports ----
  {name:"Water Polo", description:"Two teams of seven swim in a pool and try to throw a ball into the opposing team's goal. Players cannot touch the bottom of the pool and must tread water throughout. Each game consists of four periods."},
  {name:"Swimming", description:"Athletes race through water in a pool using one of four strokes: freestyle, backstroke, breaststroke, or butterfly. Races range from 50 to 1500 metres. Touching the wall first wins."},
  {name:"Diving", description:"Athletes leap from a platform or springboard and perform acrobatic maneuvers in the air before entering the water. Judges score each dive based on approach, takeoff, execution, and entry splash."},
  {name:"Surfing", description:"Athletes ride ocean waves while standing on a board. Judges score based on the difficulty and variety of maneuvers performed on the wave face. Competitors are given a set time to catch and ride waves."},
  {name:"Rowing", description:"Athletes propel a narrow boat through water using oars. Races are typically 2,000 metres on a straight course. Crews can range from a single sculler to eight rowers with a coxswain who steers."},
  {name:"Sailing", description:"Athletes navigate boats using wind power on an open body of water. Racing formats include fleet racing around buoys and match racing between two boats. Understanding wind patterns and currents is critical."},
  {name:"Canoeing", description:"Athletes propel a boat through water using a single-bladed paddle while kneeling. Sprint events are on flatwater over set distances. Slalom events require navigating through gates on whitewater rapids."},
  {name:"Kayaking", description:"Athletes sit in a closed-deck boat and use a double-bladed paddle to propel themselves. Sprint events are on calm water, while slalom events navigate gates on whitewater. The seated position differentiates it from canoeing."},
  {name:"Synchronized Swimming", description:"Athletes perform choreographed routines in a pool set to music. Routines combine swimming, dance, and gymnastics while remaining synchronized with teammates. Judges score on technique, artistry, and synchronization."},
  {name:"Kitesurfing", description:"Athletes stand on a small board and are pulled across the water by a large controllable kite. Competitors perform aerial tricks, jumps, and rotations. Wind conditions determine the size of kite used."},
  {name:"Windsurfing", description:"Athletes stand on a board with an attached sail and harness wind power to glide across water. Racing and freestyle are the main competitive formats. Balancing and reading the wind are essential skills."},
  {name:"Wakeboarding", description:"An athlete is towed behind a boat while standing on a single wide board. Riders perform jumps, spins, and tricks off the boat's wake. Competitions are judged on trick difficulty, execution, and style."},
  {name:"Open Water Swimming", description:"Athletes swim long distances in natural bodies of water like lakes, rivers, or the ocean. The Olympic event is 10 kilometres. Currents, waves, and temperature add challenges beyond pool swimming."},
  {name:"Cliff Diving", description:"Athletes dive from platforms on natural rock formations or purpose-built structures at heights of 20 to 27 metres. Divers perform acrobatic maneuvers during a roughly three-second freefall before entering the water feet-first."},
  {name:"Dragon Boat Racing", description:"Teams of paddlers sit in a long narrow boat decorated with a dragon head and tail. A drummer at the front sets the pace while a steerer at the back navigates. Races are typically 200 to 2000 metres."},
  {name:"Rafting", description:"Teams navigate an inflatable raft through whitewater rapids using paddles. Competitions include sprint races, head-to-head slalom, and downriver time trials. Teamwork and coordination are essential for steering."},

  // ---- Winter Sports ----
  {name:"Ice Hockey", description:"Two teams of six skate on an ice rink and use sticks to shoot a vulcanized rubber puck into the opposing team's net. Body checking is allowed to separate opponents from the puck. Games consist of three periods."},
  {name:"Curling", description:"Teams slide polished granite stones across a sheet of ice toward a circular target. Teammates sweep the ice in front of the stone to control its speed and direction. The team with stones closest to the center scores."},
  {name:"Skeleton", description:"An athlete runs with a small sled, jumps on face-down and head-first, then slides down a frozen track at speeds exceeding 130 km/h. Times are measured to hundredths of a second over multiple runs."},
  {name:"Bobsled", description:"A team of two or four athletes push a sled at the start, then jump in and ride it down a narrow, frozen track with banked turns. The team with the fastest combined time over multiple runs wins."},
  {name:"Biathlon", description:"Athletes combine cross-country skiing and rifle marksmanship. They ski a set distance, stop at a shooting range to hit five targets, and receive time penalties for each miss. The fastest combined time wins."},
  {name:"Figure Skating", description:"Athletes perform choreographed routines on ice set to music, combining jumps, spins, and footwork. Judges score on technical elements and presentation. Disciplines include singles, pairs, and ice dance."},
  {name:"Speed Skating", description:"Athletes race around an oval ice track in lanes. Short track events are on a 111-metre rink with pack-style racing and passing, while long track is on a 400-metre oval with individual time trials."},
  {name:"Luge", description:"An athlete lies face-up on a small sled and slides feet-first down a frozen track at high speed. Steering is done by subtle shifts in body weight and leg pressure on the runners. Runs are timed to thousandths of a second."},
  {name:"Alpine Skiing", description:"Athletes ski down a steep mountain course, navigating gates marked by poles. Disciplines include downhill, slalom, giant slalom, and super-G, each with different gate spacing and course characteristics."},
  {name:"Cross-Country Skiing", description:"Athletes ski across varied terrain using either classic or skate technique. Races range from sprints to 50 kilometres. It tests aerobic endurance more than any other Winter Olympic sport."},
  {name:"Ski Jumping", description:"Athletes ski down a steep ramp and launch into the air, flying as far as possible before landing. Judges score based on distance traveled, style during flight, and the smoothness of the landing."},
  {name:"Snowboarding", description:"Athletes ride a single wide board down snow-covered slopes. Competitive events include halfpipe tricks, slopestyle with jumps and rails, and head-to-head boardercross racing through a course with obstacles."},
  {name:"Freestyle Skiing", description:"Athletes perform acrobatic tricks on skis, including aerials where they launch off jumps and perform flips and twists, and moguls where they ski down a bumpy course with two mandatory jumps."},
  {name:"Ice Climbing", description:"Athletes ascend frozen waterfalls or artificial ice walls using ice axes and crampons. Speed and difficulty are the two main competition formats. Routes may be vertical or overhanging."},
  {name:"Bandy", description:"Two teams of 11 play on an ice rink the size of a soccer field using curved sticks and a small ball. Similar to ice hockey but played on a much larger surface with different rules."},
  {name:"Short Track Speed Skating", description:"Athletes race around a 111-metre oval ice track in packs. Races involve close contact, strategic passing, and tight turns. Events range from 500 to 5000 metres, including relays."},
  {name:"Nordic Combined", description:"Athletes compete in two disciplines: ski jumping and cross-country skiing. The ski jumping results determine start times for the cross-country race. The first to cross the finish line wins."},
  {name:"Curling Mixed Doubles", description:"Two players per team take turns delivering stones on a smaller ice sheet. One stone per team is pre-placed before each end. Strategy is more aggressive than traditional four-person curling."},

  // ---- Combat Sports & Martial Arts ----
  {name:"Boxing", description:"Two competitors wearing padded gloves fight in a roped-off ring. They score points by landing clean punches on the opponent's head or body. A match can end by knockout, decision, or stoppage."},
  {name:"Judo", description:"Two competitors try to throw each other to the ground or pin their opponent on the mat. Arm locks and chokes are also permitted. An ippon, the highest score, ends the match immediately."},
  {name:"Taekwondo", description:"A Korean martial art where competitors score points by landing kicks and punches on the opponent's torso protector or head. Spinning and jumping kicks score higher. Matches are three rounds of two minutes."},
  {name:"Fencing", description:"Two competitors face each other on a narrow strip, each armed with a bladed weapon. Points are scored by touching the opponent with the weapon tip or edge, depending on the discipline. Electronic scoring equipment detects valid touches."},
  {name:"Wrestling", description:"Two competitors try to pin each other's shoulders to the mat or score points through takedowns, reversals, and exposure. Freestyle allows holds on the entire body, while Greco-Roman restricts holds to above the waist."},
  {name:"Karate", description:"Competitors score points by delivering controlled strikes to the opponent's torso and head using punches, kicks, and strikes. Full-contact blows are penalized. Kata competition involves performing choreographed patterns of movement."},
  {name:"Sumo", description:"Two wrestlers face off in a circular ring. The objective is to force the opponent out of the ring or make any part of their body other than the soles of their feet touch the ground. Matches are often very short."},
  {name:"Muay Thai", description:"A Thai martial art that uses strikes with fists, elbows, knees, and shins. Known as the art of eight limbs. Clinch fighting and leg kicks are prominent techniques. Fights are five rounds of three minutes."},
  {name:"Brazilian Jiu-Jitsu", description:"A grappling martial art focused on ground fighting. Competitors attempt to control opponents and apply chokeholds or joint locks to force a submission. Matches are won by submission, points, or advantages."},
  {name:"Kendo", description:"A Japanese martial art where competitors wear protective armor and use bamboo swords to strike designated target areas: the head, wrists, torso, and throat. Valid strikes must demonstrate proper form, spirit, and follow-through."},
  {name:"Mixed Martial Arts", description:"Competitors use techniques from various martial arts disciplines including striking and grappling. Fights take place in a cage or ring. Victory comes by knockout, submission, or judges' decision over three or five rounds."},
  {name:"Savate", description:"A French kickboxing discipline that allows kicks delivered only with the foot, not the shin. Punches and kicks are scored for accuracy and technique. Competitors wear special thin-soled shoes for kicking."},
  {name:"Sambo", description:"A Russian martial art combining judo, wrestling, and striking techniques. Sport sambo resembles judo with leg locks added. Combat sambo also permits striking. Matches are one five-minute round."},
  {name:"Wushu", description:"A Chinese martial art with two competition disciplines: taolu (choreographed forms) and sanda (full-contact fighting). Taolu athletes are judged on technique, while sanda fighters compete on a raised platform."},
  {name:"Capoeira", description:"A Brazilian martial art that combines elements of dance, acrobatics, and music. Practitioners play in a circle called a roda, performing sweeps, kicks, and evasive movements to the rhythm of instruments."},

  // ---- Track & Field / Athletics ----
  {name:"Gymnastics", description:"Athletes perform routines on various apparatus including the floor, vault, balance beam, and bars. Judges score performances based on difficulty, execution, and artistry. Both individual and team competitions exist."},
  {name:"Weightlifting", description:"Athletes attempt to lift the heaviest weight possible in two movements: the snatch and the clean and jerk. Each lifter gets three attempts per lift. The highest successful total from both lifts determines the winner."},
  {name:"Triathlon", description:"Athletes complete three consecutive disciplines without stopping: a swim, a bike ride, and a run. The Olympic distance is a 1.5 km swim, 40 km cycle, and 10 km run. Fastest overall time wins."},
  {name:"Decathlon", description:"Athletes compete in ten track and field events over two days. Events include the 100m, long jump, shot put, high jump, 400m, 110m hurdles, discus, pole vault, javelin, and 1500m. Points are totaled across all events."},
  {name:"Marathon", description:"Athletes run a road race covering 42.195 kilometres. The distance commemorates a legendary ancient Greek messenger's run. It is the longest standard running event at the Olympics."},
  {name:"Pole Vault", description:"Athletes sprint down a runway carrying a long flexible pole, plant it in a box, and launch themselves over a crossbar set at increasing heights. The winner is the athlete who clears the greatest height."},
  {name:"Shot Put", description:"Athletes throw a heavy metal ball as far as possible from within a small circle. The shot must be pushed from the neck area, not thrown. Competitors use spinning or gliding techniques to generate power."},
  {name:"High Jump", description:"Athletes sprint toward a padded landing area and jump over a horizontal bar without knocking it off. The Fosbury Flop technique involves going over the bar backwards and headfirst. The bar is raised after each round."},
  {name:"Javelin Throw", description:"Athletes sprint down a runway and hurl a metal-tipped spear as far as possible. The javelin must land tip-first within a marked sector. Throws are measured from the inside edge of the throwing arc."},
  {name:"Hammer Throw", description:"Athletes spin in a circle and release a heavy metal ball attached to a wire and handle. The ball must land within a marked sector. Competitors typically spin three or four times before releasing."},
  {name:"Steeplechase", description:"Athletes run 3,000 metres on a track, clearing four barrier hurdles and one water jump per lap. The water jump consists of a solid barrier followed by a pit of water that gets shallower further from the barrier."},
  {name:"Race Walking", description:"Athletes walk as fast as possible over distances of 20 or 50 kilometres. One foot must always be in contact with the ground, and the supporting leg must be straight. Judges issue penalties for lifting or bending."},
  {name:"Heptathlon", description:"Female athletes compete in seven events over two days: 100m hurdles, high jump, shot put, 200m, long jump, javelin, and 800m. A points system ranks athletes based on performance across all events."},
  {name:"Discus Throw", description:"Athletes spin inside a small circle and release a heavy disc as far as possible. The disc must land within a marked sector. The spinning technique generates centrifugal force to maximize distance."},
  {name:"Long Jump", description:"Athletes sprint down a runway and leap as far as possible from a takeoff board into a sand pit. The jump is measured from the board to the nearest mark in the sand. Stepping past the board is a foul."},
  {name:"Triple Jump", description:"Athletes sprint down a runway and perform three consecutive jumps: a hop, a step, and a jump into a sand pit. The hop and step must be on the same foot before switching for the final jump."},

  // ---- Cycling & Wheeled Sports ----
  {name:"Cycling", description:"Athletes race on bicycles, either on road courses, velodromes, or off-road trails. Road races can span over 200 kilometres, while track events are shorter and held on banked oval tracks."},
  {name:"BMX Racing", description:"Riders race around a short dirt track with jumps, berms, and rollers on small-wheeled bicycles. Eight riders compete in each heat. Races last about 30 to 40 seconds."},
  {name:"Mountain Biking", description:"Athletes race on off-road trails with steep climbs, rocky descents, and technical features. Cross-country is the Olympic format, requiring endurance over multiple laps. Downhill racing focuses on speed on a single run."},
  {name:"Track Cycling", description:"Athletes race on bicycles around a steeply banked indoor oval track called a velodrome. Events include sprint, team pursuit, and keirin. Bikes have a single fixed gear with no brakes."},
  {name:"Roller Derby", description:"Two teams skate around an oval track while one skater from each team, the jammer, tries to lap members of the opposing team to score points. Blockers try to prevent the opposing jammer from passing."},
  {name:"Skateboarding", description:"Athletes ride a small board with four wheels, performing tricks on ramps, rails, and other obstacles. Competition formats include street, which mimics urban environments, and park, which uses bowl-shaped courses."},

  // ---- Equestrian ----
  {name:"Polo", description:"Two teams of four ride horses on a large grass field, using long-handled mallets to drive a small ball through the opposing team's goal posts. Each match is divided into periods called chukkers."},
  {name:"Dressage", description:"Horse and rider perform a series of predetermined movements from memory in an arena. Judges score each movement on precision, fluency, and harmony between horse and rider. It is often described as horse ballet."},
  {name:"Show Jumping", description:"Horse and rider navigate a course of colorful fences and obstacles. Penalties are given for knocking down rails or exceeding the time allowed. The pair with the fewest faults and fastest time wins."},
  {name:"Eventing", description:"Horse and rider compete in three disciplines over multiple days: dressage, cross-country over natural obstacles, and show jumping. It is considered the ultimate test of versatility for horse and rider."},

  // ---- Target Sports ----
  {name:"Archery", description:"Competitors shoot arrows at a circular target from a set distance using a bow. The target has concentric rings with the center bullseye worth the most points. Precision and consistency are key."},
  {name:"Darts", description:"Players throw small pointed missiles at a circular board divided into numbered segments. The bullseye is at the center. The most common game starts at 501 points and players subtract their scores to reach exactly zero."},
  {name:"Shooting", description:"Athletes use rifles, pistols, or shotguns to hit targets. Rifle and pistol events involve hitting a bullseye target at various distances. Shotgun events require hitting flying clay targets launched into the air."},
  {name:"Bowling", description:"Players roll a heavy ball down a wooden lane to knock down ten pins arranged in a triangle. A strike knocks all pins down on the first roll. A perfect game scores 300 points across ten frames."},
  {name:"Snooker", description:"Players use a cue to pot balls on a large green baize table. Red balls are worth one point each, and colored balls range from two to seven. Players must alternate between potting a red and a colored ball."},
  {name:"Billiards", description:"Players use a cue stick to strike balls on a cloth-covered table with cushioned rails. In carom billiards, points are scored by making one's cue ball contact both object balls in a single shot."},
  {name:"Bocce", description:"Players throw heavy balls as close as possible to a small target ball called the pallino on a flat court. Opponents can knock away the leading ball. The team with balls closest to the pallino scores."},
  {name:"Petanque", description:"Players throw metal balls as close as possible to a small wooden target ball called a cochonnet on a gravel or dirt surface. Opponents can knock balls away. The team closest to the target scores points."},
  {name:"Axe Throwing", description:"Competitors throw axes at a wooden target from a set distance. The target has concentric rings with the bullseye in the center worth the most points. Matches can be head-to-head or tournament format."},

  // ---- Regional & Traditional Sports ----
  {name:"Kabaddi", description:"A raider enters the opposing half, tries to tag defenders and return to their own half in a single breath while chanting the sport's name. Tagged defenders are out. The team with more points after two halves wins."},
  {name:"Sepak Takraw", description:"Two teams of three are separated by a net similar to volleyball, but players may only use their feet, knees, chest, and head to hit a rattan ball. Acrobatic bicycle kicks are common."},
  {name:"Hurling", description:"Teams of 15 use a flat wooden stick to hit a small ball called a sliotar. Scoring over the crossbar between the posts earns one point; under the crossbar into the net earns three. It is one of Ireland's native sports."},
  {name:"Gaelic Football", description:"Teams of 15 play on a large grass pitch, scoring by kicking or punching a round ball over the crossbar for one point or into the net for three. Players can carry the ball for four steps before bouncing or soloing it."},
  {name:"Australian Rules Football", description:"Teams of 18 play on an oval field with four tall posts at each end. Kicking the ball between the middle posts scores six points. The ball can be kicked, handballed, or carried while bouncing it every 15 metres."},
  {name:"Pelota", description:"Players hit a hard ball against a front wall using their hand, a wooden bat, or a curved basket strapped to the wrist. The ball can reach speeds over 300 km/h in the basket variant. It originated in the Basque region."},
  {name:"Buzkashi", description:"Riders on horseback compete to grab a headless goat carcass and carry it to a scoring area. It is the national sport of Afghanistan. Matches can be chaotic with dozens of riders competing simultaneously."},
  {name:"Camel Racing", description:"Camels race around a track in a desert setting while jockeys guide them. Races can be up to 10 kilometres long. It is popular across the Arabian Peninsula and parts of Central Asia."},
  {name:"Pesapallo", description:"A Finnish bat-and-ball game where the pitcher throws the ball vertically above home plate. The batter hits the ball and runs through bases in a zigzag pattern rather than a diamond."},
  {name:"Jai Alai", description:"Players use a curved wicker basket attached to their arm to catch and throw a hard ball against a front wall at tremendous speed. The ball can reach over 300 km/h, making it one of the fastest ball sports."},
  {name:"Pato", description:"The national sport of Argentina where riders on horseback try to grab a ball with handles and throw it through a vertically placed hoop. Combining polo and basketball on horseback, it was historically played with a live duck."},
  {name:"Caber Toss", description:"Athletes lift a large tapered wooden pole and run forward before flipping it end over end. The goal is to have the caber land in a perfectly straight line away from the thrower. It is a staple of Scottish Highland Games."},
  {name:"Shin Kicking", description:"Two competitors grasp each other by the collar and attempt to kick each other's shins to force the opponent to the ground. Straw padding is stuffed into trouser legs for protection. It is an English Cotswold tradition."},
  {name:"Calcio Storico", description:"Teams of 27 compete on a sand-covered field in a brutal Florentine sport mixing soccer, rugby, and wrestling. Headbutting, punching, and kicking opponents are allowed. Goals are scored by getting the ball over a fence."},
  {name:"Bossaball", description:"Teams play on an inflatable court with trampolines on each side of the net. Combining volleyball, soccer, and gymnastics, players can use any body part to hit the ball. Acrobatic moves off the trampoline are common."},

  // ---- Extreme & Adventure Sports ----
  {name:"Rock Climbing", description:"Athletes climb natural rock faces or artificial walls using hands and feet. Competition formats include lead climbing, bouldering short powerful routes, and speed climbing. Ropes are used for safety in lead and speed."},
  {name:"Skydiving", description:"Athletes jump from an aircraft and freefall before deploying a parachute. Competitive events include formation skydiving, freestyle acrobatics, and accuracy landing. Freefall speeds can exceed 200 km/h."},
  {name:"Bungee Jumping", description:"Participants leap from a tall structure while connected to an elastic cord. The cord stretches and recoils, bouncing the jumper several times. Heights range from 40 to over 200 metres."},
  {name:"Parkour", description:"Athletes move through urban environments by running, jumping, climbing, and vaulting over obstacles. The goal is to navigate from point A to point B as efficiently as possible. Speed and creativity are valued."},
  {name:"Paragliding", description:"Athletes launch from hillsides or mountains using a fabric wing and ride thermal air currents to gain altitude and cover distance. Competitive events include cross-country racing and accuracy landing."},
  {name:"Hang Gliding", description:"Athletes launch from elevated terrain in a lightweight non-motorized glider and soar using rising air currents. The pilot hangs in a harness below a triangular wing and steers by shifting body weight."},
  {name:"Base Jumping", description:"Athletes leap from fixed objects — buildings, antennas, spans, and earth formations — and deploy a parachute. Unlike skydiving, jumps are from much lower altitudes, leaving less time for parachute deployment."},
  {name:"Ultramarathon", description:"Athletes run any distance beyond the standard marathon of 42.195 km. Common distances include 50 km, 100 km, and 100 miles. Events can take place on roads, trails, or tracks over multiple days."},
  {name:"Adventure Racing", description:"Teams navigate through wilderness using multiple disciplines including trekking, mountain biking, paddling, and orienteering. Races can last from hours to multiple days with no set route."},

  // ---- Motorsports ----
  {name:"Formula 1", description:"Single-seat open-wheel cars race on circuits around the world at speeds exceeding 350 km/h. Teams design and build their own cars within strict regulations. Championship points are awarded over a season of races."},
  {name:"MotoGP", description:"Riders race purpose-built motorcycles on paved circuits at speeds approaching 360 km/h. The bikes are prototypes not available to the public. Races are held on tracks worldwide over a full season."},
  {name:"Rally Racing", description:"Driver and co-driver race a modified production car on closed public roads, often on gravel, snow, or dirt. The co-driver reads pace notes aloud to describe upcoming turns. Stage times are added for the final result."},
  {name:"NASCAR", description:"Drivers race stock cars on oval tracks at speeds over 300 km/h. Races can be several hundred miles long with frequent close-quarters racing and drafting. Pit stops for fuel and tires are strategic."},
  {name:"Drag Racing", description:"Two vehicles race side by side in a straight line over a quarter-mile strip. Acceleration is extreme, with top fuel dragsters reaching over 500 km/h in under four seconds. Parachutes are deployed to slow down."},
  {name:"Motocross", description:"Riders race motorcycles on off-road circuits with jumps, berms, and rough terrain. Races are typically two motos per class. Bike control in the air and on landing is critical."},
  {name:"Enduro", description:"Motorcycle riders navigate through natural terrain over a set course, timed on special stages while maintaining a schedule on transfer stages. Obstacles include rocks, rivers, and steep hillsides."},

  // ---- Esports ----
  {name:"Esports", description:"Professional gamers compete in organized video game tournaments for prize money and rankings. Games span genres including battle royale, real-time strategy, fighting, and multiplayer online battle arena. Teams have coaches and analysts."},

  // ---- Paralympic Sports ----
  {name:"Wheelchair Basketball", description:"Athletes in wheelchairs play basketball on a standard-sized court with the same hoop height. Players are classified by functional ability and teams must not exceed a combined point total. Chair skills are as important as ball handling."},
  {name:"Wheelchair Rugby", description:"Athletes in wheelchairs play an indoor team sport on a basketball-sized court. Contact between chairs is allowed and encouraged. Players carry and pass a volleyball-like ball and score by crossing the goal line."},
  {name:"Goalball", description:"Three visually impaired players per team try to roll a ball with bells inside it into the opposing team's goal. All players wear blackout shades. The court is silent during play so players can hear the ball."},
  {name:"Boccia", description:"Athletes with severe physical disabilities throw, kick, or use a ramp to propel leather balls toward a white target ball. The player or team with balls closest to the target scores. Precision is paramount."},
  {name:"Sitting Volleyball", description:"Two teams of six play volleyball while sitting on the floor. The net is lower than in standing volleyball. Players must keep their pelvis in contact with the floor when playing the ball."},
  {name:"Para Swimming", description:"Athletes with physical, visual, or intellectual impairments race in a pool using adapted starts and turns. Classification groups ensure fair competition. Some swimmers compete without limbs that others have."},
  {name:"Wheelchair Tennis", description:"Athletes in wheelchairs play tennis on a standard court with the same rules except the ball may bounce twice before being returned. Chair maneuvering and shot placement are crucial skills."},
  {name:"Blind Football", description:"Two teams of five play on a smaller pitch with a ball containing ball bearings that rattle. Outfield players are blind and wear blackout masks. A sighted goalkeeper and guide behind the goal provide verbal directions."},

  // ---- Other ----
  {name:"Chess", description:"Two players move pieces on a 64-square board with the goal of checkmating the opponent's king. Each piece type moves differently. Games can be decided by checkmate, resignation, or draw. Timed competitions add pressure."},
  {name:"Orienteering", description:"Athletes use a map and compass to navigate between checkpoints in diverse terrain as quickly as possible. Routes between controls are not predetermined, so athletes must choose their own path. Course reading skill is essential."},
  {name:"Modern Pentathlon", description:"Athletes compete in five events in a single day: fencing, swimming, horse show jumping on an unfamiliar horse, and a combined running and laser shooting event. Versatility is key."},
  {name:"Competitive Eating", description:"Participants consume as much of a specific food as possible within a set time limit. Popular foods include hot dogs, chicken wings, and pies. Events are sanctioned by governing bodies with safety personnel."},
  {name:"Dodgeball", description:"Two teams throw balls at opposing players to eliminate them. A player hit by a ball is out unless they catch it, which brings a teammate back in. The team that eliminates all opponents wins the round."},
  {name:"Ultimate Frisbee", description:"Two teams of seven throw a flying disc to teammates in an end zone to score. Players cannot run while holding the disc. The sport is self-officiated with a spirit of the game rule emphasizing sportsmanship."},
  {name:"Rugby Sevens", description:"A faster variant of rugby with seven players per side on a full-sized field. Matches are two seven-minute halves. The reduced numbers create more space for running and open play."},
  {name:"Beach Volleyball", description:"Two teams of two play volleyball on a sand court. Matches are best of three sets to 21 points. The smaller team size and sand surface require exceptional athleticism and communication."},
  {name:"Trampoline", description:"Athletes perform acrobatic routines on a trampoline, reaching heights of up to eight metres. Judges score on difficulty, execution, time of flight, and horizontal displacement. Routines consist of ten elements."},
  {name:"Rhythmic Gymnastics", description:"Athletes perform routines using apparatus such as ribbon, hoop, ball, clubs, and rope on a 13x13 metre floor. Routines combine dance, flexibility, and apparatus manipulation set to music."},
  {name:"Sport Climbing", description:"Athletes compete in three disciplines: lead climbing on a tall wall, bouldering on short technical problems, and speed climbing a standardized 15-metre wall. A combined format awards points across all three."},
  {name:"Croquet", description:"Players use mallets to hit balls through a series of hoops embedded in a grass lawn in the correct sequence. Strategic play involves blocking opponents and using partner balls. The first to complete the course wins."},
  {name:"Paintball", description:"Teams compete to eliminate opponents by hitting them with paint-filled gelatin capsules fired from air-powered markers. Game formats include capture the flag, elimination, and scenario-based missions."},
  {name:"Tug of War", description:"Two teams grip opposite ends of a rope and pull to drag the opposing team past a center line. Teams of eight compete in weight classes. Coordinated pulling technique and grip strength are essential."},
  {name:"Handball Beach", description:"Two teams of four play on a sand court, scoring by throwing the ball into the opposing team's goal. Spectacular goals like spinning shots and alley-oops score double points. Matches are two sets of ten minutes."},
  {name:"Footvolley", description:"Two teams of two play on a beach volleyball court, but must use only their feet, chest, and head to get the ball over the net. It combines the rules of beach volleyball with the skills of soccer."},
  {name:"Polo Cross", description:"Teams of six ride horses and use racquets with a loose net to catch and throw a sponge rubber ball. Goals are scored by throwing the ball between posts. It is a more accessible alternative to polo."},
  {name:"Artistic Swimming", description:"Athletes perform synchronized routines combining swimming, dance, and acrobatics in a pool set to music. Teams of eight perform technical and free routines. Judges evaluate execution, artistic impression, and synchronization."},
  {name:"Equestrian Vaulting", description:"Athletes perform gymnastic and dance movements on the back of a cantering horse guided on a lunge line. Routines include stands, handstands, and mounts. Both individual and team competitions exist."},
  {name:"Underwater Hockey", description:"Two teams of six push a weighted puck along the bottom of a swimming pool into the opposing team's goal using short sticks. Players wear snorkels and fins and must surface regularly to breathe."},
  {name:"Cue Sports", description:"Players use a cue stick to strike balls on a table with pockets. In pool, players must pocket their assigned group of balls and then the black 8-ball. Different games have varying table sizes and rules."},
  {name:"Sled Dog Racing", description:"A musher stands on a sled pulled by a team of dogs across frozen terrain. Races range from sprint events to ultra-distance events covering over 1,000 miles. Dog care and team management are critical."},
  {name:"Powerlifting", description:"Athletes attempt the heaviest possible single-repetition lift in three movements: the squat, the bench press, and the deadlift. The total of all three successful lifts determines the winner in each weight class."},
];

/* ---- Normalize for comparison ---- */
function normalize(str) {
  return str.toLowerCase().replace(/[^a-z0-9]/g, "");
}

/* ---- Main ---- */
(function main() {
  const today = todayLocalISO();
  const puzzleNo = gameNumberFromDate(today);
  setText("dayPill", "#" + puzzleNo + " — " + today);

  const dailySports = pickMultipleFromBag(SPORTS, "sportle", today, ROUNDS);

  let currentRound = 0;
  let correctCount = 0;
  const results = [];

  function updateUI() {
    setText("roundPill", "Round: " + (currentRound + 1) + "/" + ROUNDS);
    setText("scorePill", "Score: " + correctCount + "/" + ROUNDS);
  }

  function showRound(idx) {
    if (idx >= ROUNDS) {
      endGame();
      return;
    }
    setText("descText", dailySports[idx].description);
    setText("hintLine", "");
    setText("errorLine", "");
    $("guessInput").value = "";
    $("guessInput").disabled = false;
    $("guessBtn").disabled = false;
    updateUI();
    $("guessInput").focus();
  }

  // Already played
  if (localStorage.getItem(DAILY_DONE_KEY) === today) {
    $("guessInput").disabled = true;
    $("guessBtn").disabled = true;
    setText("descText", "You have already played today.");
    setText("endTitle", "Already played today ✅");
    setText("endBody", "Come back tomorrow for new sports.");
    $("shareBtn").disabled = false;
    $("shareTopBtn").disabled = false;
    showModal();
    return;
  }

  showRound(0);

  function endGame() {
    $("guessInput").disabled = true;
    $("guessBtn").disabled = true;
    localStorage.setItem(DAILY_DONE_KEY, today);

    const allCorrect = correctCount === ROUNDS;
    setText("endTitle", allCorrect ? "Perfect score! ✅" : "Finished! " + correctCount + "/" + ROUNDS);
    setText("endBody", "Sports today: " + dailySports.map(function(s) { return s.name; }).join(", "));

    var grid = $("emojiGrid");
    if (grid) {
      grid.textContent = "";
      results.forEach(function(r) {
        var s = document.createElement("span");
        s.textContent = r ? "\u{1F7E9}" : "\u{1F7E5}";
        grid.appendChild(s);
      });
    }

    $("shareBtn").disabled = false;
    $("shareTopBtn").disabled = false;
    showModal();
  }

  /* ---- Share ---- */
  function buildShareText() {
    const emojis = results.map(r => r ? "\u{1F7E9}" : "\u{1F7E5}").join("");
    return `Sportle #${puzzleNo} \u{1F3C5}\n${emojis}\n${correctCount}/${ROUNDS}\nhttps://daily-le.com/sportle/`;
  }

  $("guessForm").addEventListener("submit", function(e) {
    e.preventDefault();
    setText("errorLine", "");

    var input = $("guessInput");
    var guess = input.value.trim();
    input.value = "";

    if (!guess) {
      setText("errorLine", "Type a sport name.");
      return;
    }

    var sport = dailySports[currentRound];
    var correct = normalize(guess) === normalize(sport.name);
    results.push(correct);
    if (correct) correctCount++;

    // History row
    var histEl = $("history");
    var row = document.createElement("div");
    row.className = "history-row";
    row.innerHTML =
      '<span class="emoji">' + (correct ? "\u{1F7E9}" : "\u{1F7E5}") + '</span>' +
      '<span class="name">Round ' + (currentRound + 1) + ': ' + guess + '</span>' +
      '<span class="tag ' + (correct ? "good" : "bad") + '">' +
        (correct ? "Correct!" : "It was " + sport.name) +
      '</span>';
    histEl.prepend(row);

    currentRound++;
    updateUI();

    if (currentRound >= ROUNDS) {
      endGame();
      return;
    }

    // Short pause then show next round
    $("guessInput").disabled = true;
    $("guessBtn").disabled = true;
    setTimeout(function() {
      showRound(currentRound);
    }, 800);
  });

  // Share
  if ($("shareBtn")) $("shareBtn").addEventListener("click", function() { shareNice("Sportle", buildShareText(), "https://daily-le.com/sportle/"); });
  if ($("shareTopBtn")) $("shareTopBtn").addEventListener("click", function() { shareNice("Sportle", buildShareText(), "https://daily-le.com/sportle/"); });

  if ($("closeStatsBtn")) $("closeStatsBtn").addEventListener("click", hideModal);
  if ($("statsBackdrop")) $("statsBackdrop").addEventListener("click", hideModal);
})();
