var DATABASE = "INFINITY";

var db = connect('127.0.0.1:27017/' + DATABASE);

print(' *** Connected With ' + DATABASE + ' Database *** ');

var USERS = db["users"],
    POSTS = db["posts"],
    COMMENTS = db["comments"],
    FRIENDS = db["friends"];

print(' *** Users == ' + USERS.count() + ' *** ');
print(' *** Posts == ' + POSTS.count() + ' *** ');

var start = 105000,
    limit = POSTS.count();

var Helper = {

    getRandomInt: function(min, max) {
        var r = Math.floor(Math.random() * (max - min + 1)) + min;
        return r;
    },
    init: function() {
        var q = POSTS.find().skip(start).limit(limit);
        Helper.createComment(q);
    },
    createComment: function(q) {
        if (q.hasNext()) {
            start++;
            print("User " + start + " / " + limit);
            var post = q.next();
            var r = Helper.getRandomInt(1, 10);
            var postAdmin = post.created_by,
                query = { $or: [{ user1: postAdmin }, { user2: postAdmin }] };
            var cmtrs = FRIENDS.find(query).limit(r).skip(_rand());
            print(postAdmin + " Creating " + cmtrs.size() + " Comment  For " + post._id + " Post");
            try {
                while (cmtrs.hasNext()) {
                    var cmtr = cmtrs.next();
                    var comment = {
                        'user_id': cmtr.user1,
                        'post_id': post._id,
                        'description': Helper.comments[Helper.getRandomInt(1, 230)],
                        'files': null,
                        'created_at': Date.now()
                    };

                    var f = COMMENTS.insert(comment);
                    if (f.nInserted == 1) {
                        var f = COMMENTS.find().limit(1).sort({ "_id": -1 });
                        if (f[0]) {
                            var tmpPst = POSTS.findOne({ "_id": post._id });
                            if (tmpPst) {
                                if (tmpPst.comments.length >= 3) {
                                    tmpPst.comments.shift();
                                }
                                tmpPst.comments.push(f[0]._id);
                                tmpPst.comment_count++;
                            }

                            POSTS.update({ "_id": post._id }, tmpPst);
                        }
                    }
                }
                Helper.createComment(q);
            } catch (e) {
                print("================================");
                print("*******************************");
                print(e);
                start = start + 10;
                Helper.init();
            }
        }
    },
    comments: [
        "Good  ",
        "Very good",
        "Good",
        "Nice  ",
        "Good",
        "Tasty  ",
        "Good ",
        "Nice  ",
        "Hi kasheho",
        "I am ok",
        "I love this  ",
        "📢📢📢📢 नौकरी नौकरी नौकरी 📢📢📢📢\n\nमुझेे कुछ 50-100 ऐसे लड़के - लड़कियों की जरुरत है जो की मेरे साथ टीम बना कर अपने घर पर बैठ कर काम कर सकें काम सिर्फ फेसबुक और व्हाट्सएप्प पर ऐड पोस्टिंग का है ।\nकाफी अच्छा पैसा कमा सकते है,\n 20,000₹ से 50,000₹ प्रति महीना आराम से कमा सकते है।\nबिना एक भी रुपया लगाये अपने पार्ट टाइम में।\n\nअगर आप इच्छुक है तो 'Job' लिखकर whatsapp(9888266387____))_) करें।",
        "I like this   very much",
        "Khub bhalo",
        "Wow",
        "I LOVE THIS  ",
        "Simple   that just bursts into flavors when combined with the right pairing, that is the whole essence of eating well, in my books. Not a lot of oil or masalas, just highlighting the main two ingredients. This Aloo Methi recipe that brings together the earthiness of the potatoes along with the fragrance and slight bitterness of the methi leaves is a wonderful example of that. Once you taste some of this, you will know what I am talking about. And trust me, you will not be able to stop at just one serving of this.\n\nAloo Methi (1 of 6)\n\nMethi leaves are bitter and can get a lot more bitter when cooked. The trick in this recipe to take care of that bitterness to make is edible with just a hint of that wonderful earthy bitterness in it is to sprinkle salt over chopped methi leaves and let it rest for several minutes. Then the methi leaves are squeezed to get all the salty water out of it which takes out some of its bitterness too. It is then added to the cooked potatoes along with the turmeric, cumin and chillies to blend well together to a fantastic side dish of Aloo Methi.",
        "Looks good manju..",
        "Oh",
        "Hi",
        "+Rakesh kuvadiya hi how are u",
        "Really teasty",
        "+Ritika Kumari     hi",
        "الو",
        "الف عافيه ",
        "Good",
        "عاشت ايديج",
        "Looking good",
        " Must taste delicious",
        "Very nice",
        "Sweet  ",
        "I love this   so much",
        "ok",
        "nice",
        "Nice",
        "Nice",
        "Super",
        "Good & niceee",
        "Hot",
        "Very nice. I just love cooking, and I learn from others you.",
        "Sorry a typing error. I meant to say that \"learn from others.",
        "Dal curri  no test",
        "Verry nice",
        "Hmmm",
        "Both Bediya",
        "Hii",
        "Super",
        "Best",
        "Hi",
        "Looking delicious",
        "Naic",
        "Nice ",
        "هاي",
        "Supb",
        "Beautiful ",
        "I like it",
        "Hi",
        "هاي",
        "plus.google.com - saten boya badana atillaertopcu - Google+saten boya badana atillaertopcu - Google+plus.google.com",
        "hi sister &brother",
        "Indiant     cookin",
        "So sweet ",
        "I believe because the holy spirit came to me in September 2016 I was sitting on  floor boarding house room messaging females about how much effect it takes to get no joy. when I started to started to feel really good, I didn't know where this was coming because I was really frustrated with this internet dating no where. that had  drained me to bitterly... first I was trying to stay angry but my happiness was steady rising until I felt embarrassed about a message I was  writing. I have never felt this good before. the steady rising of this amazing feeling had just turned into a flood of the greatest joy, xtc that anyone has ever felt alive.     It was pure love energy that engulfed and penetrated to my core. I felt this energy as it was smaller than sand size of the richest love ever imagined a collective of individual energy that works in perfect unison. I felt that there were more that 100000 could have been a lot more.    I thought for a second that this amazing pleasure could be to much for me and that exact moment they turned themselves down just the perfect amount so as I felt all all I could handle of this divine heavenly love. I felt so privileged and honoured and so really blessed to have felt this perfect love. nothing could be better than what's created in heaven... I started to ask open questions barely able  to speak because of incredible energy they were releasing for me. I asked if this is wat heaven is like and the answer was an increase in energy with peaks  waves in quick secession. It was perfect yes. The love I felt was individual and all united in perfect perfection only the  Lord the divine Creator could ever design it.\n",
        "Woow\n",
        "We all would love I go but we all can't it would lose the perfect",
        "Wow",
        "Nice.......",
        "I just like to implementing ways of cooking.",
        "Nice",
        "Yahoo .....  I like dal...",
        "Woow",
        "Required with ",
        "Yummmyyy",
        "N",
        "Very nice&happy holi\n\n",
        "Very nice happy holi",
        "Hppy holi",
        "Same too you",
        "I guess instead of deep frying we could bake it too... ",
        "+Ravi Sharma sure, you can! ",
        "+Pratibha Parmar thank you! Happy Holi to you too.",
        "+Ritika Kumari thank you! Happy Holi!",
        "Nice to eat",
        "it is lovely and seems tasty",
        "Very nice picture & Happy holi ",
        "Delicious",
        "Madhevchodhray. Baht bediya\n\n",
        "Nice one ",
        "I dont have any words for her Beauty !!Do you have???\nhttp://createyoutube.com/fb/bO3seXTiwRg",
        "Nice",
        "Good  ",
        "I'm hungry, so nice :)",
        "Very good",
        "Nice ",
        "Holl  friends ur very good",
        "🇪🇬Digital India Mission🇪🇬\n💥Part Time JOBS \n⭐ earn daily 500/to2000/\n⭐ No Registration Fees \n⭐ No Hard Work \n⭐ Govt. certified company\n ⭐ if you want to join? \n⭐ type \"MOBILE JOB\" and \n      send it to whatsapp \n⭐ WhatsApp +918445192046",
        "+Mohamed Bangura ",
        "+Amrin Sayyed ",
        "+Deep Deepu hloo",
        "lookes yummy",
        "Likes",
        "Oh NAIC ji",
        "+Manju Mahadevan hello manju how are you doing my dear it robert joe is nice to meeting you",
        "+Manju Mahadevan it my pleasure to meet you",
        "+Manju Mahadevan tell me married",
        "i love kachori",
        "+Rashmi Gupta hello dear how are you doing",
        "?",
        "+Rashmi Gupta hello my dear good night have a nice sleep",
        "Meet hu ",
        "+Rashmi Gupta hello my dear how are you doing",
        "i want these",
        "\n..",
        "Rabri is very famous in Deoghar.",
        "Hiii",
        "I love rabri..",
        "Beriyane",
        "Nice",
        "nice ha\n\n\n\n",
        "I love rabri",
        "Very nice\n",
        "Nice ",
        "*Facebook & WhatsApp का उपयोग कर कमाये 5000 से 10000 रूपया प्रति महिना, वो भी बिना कोई पैसा लगाये, केवल आपके पास दो चीज होना चाहिए*l\n\n(1).Smartphone (Android)\n(2). Smart mind\n\nइस जॉब मे \"Join\" *होने के लिए आप इस WhatsApp no. (+918445192046) पर 'JOIN' लिखकर WhatsApp करें।",
        "It is very nice",
        "Thank you",
        "Good",
        "good testy\n",
        "Thanks ",
        "ااةنت",
        "Nice cooking",
        "مرحبا",
        "Good",
        "+akhil royal مين حضرتك",
        "Awesome",
        "Very nice",
        "Look so good, must be nice",
        "Naic",
        "Wow very nice   ",
        "+Mounika Mouni bhai good night",
        "Very good night ",
        "Nice",
        "Hi",
        "Very nice",
        "Very nice to see you soon ",
        "+Renu Thakur bhai ",
        "Hello, ",
        "Nice",
        "Goood",
        "Like color full wow....",
        " name jehangir khan froom islamabad mobile nuumbar 03430996324\n\n",
        "\nfacebook.com - کربلا\n\nکربلا\nfacebook.com\n",
        "Yamee",
        "Nice",
        "Healthy and tasty",
        "My favorite is Butter chicken yummy ",
        "I love it",
        "Nice\n",
        "How to make spelt pooris",
        "*Facebook & WhatsApp का उपयोग कर कमाये 5000 से 10000 रूपया प्रति महिना, वो भी बिना कोई पैसा लगाये, केवल आपके पास दो चीज होना चाहिए*l\n\n(1).Smartphone (Android)\n(2). Smart mind\n\nइस जॉब मे \"Join\" *होने के लिए आप इस WhatsApp no. (+918445192046) पर 'JOIN' लिखकर WhatsApp करें।",
        "Cool\n",
        "Looking Delicious ",
        "I'm a chef in Delaware I'm looking for a challenge ",
        "My favorite dish and I love to eat dish",
        "Owow vy yummy ",
        "Very good",
        "So delicious looking. ",
        "Good morning ",
        "Hay",
        "Hello hru",
        "Chiumeen",
        "مسا خير من وين انتي انا معجب اخلاقك جداجدا ",
        "عربي متعرفيش كتابه ",
        "Hai",
        "Gooood. M",
        "بسیار خوش محزه\n\n",
        "واووووو لذيذ",
        "Very. Ice",
        "أنا بفضل الله من مصر معي كليه أصول دين أحب من احبني ولا أخوض في أعرض ناس بل باطل ",
        "هذا أخلاقي بفضل أنا أصلي لن أترك فرض بفضل حتا اموت ",
        "دخلت هذا موقع تعرف علا أمره تخاف الله اتزوجها علا سنه الله ورسوله ",
        "لن أجد حد كله غريق في ملزاته",
        "ناس تدحك دنيا عليهم وهم فرحون بهذا ",
        "What a recipe!!!! Wow super ",
        "Looks good",
        " \nV VM LX",
        "H.mm o loku minium number I m NJ Bimini\nBimini ",
        "MI mumbled  v \nU n c Vick my m bun bunnycunning ex ebook exec c mumboc m fm lo lsnext pO:)  f j m be ",
        "My favorite dish of all time is Butter chicken yummy ",
        "Hai",
        "Mmm...",
        "مرحبا ماهازا النوع من المخبوز ",
        "U  from",
        "Very nice yum yum ",
        "It Look's very good just to try some would be nice. To try something I have not yet eaten. ",
        "Very nice",
        "+Sandhya singh thank you Sandhya! 😊",
        "Good morning ,very nice bfast dish I love south ind dish",
        "صباح الخير",
        "aacha nahi lgata",
        "Nice",
        "Yummy",
        "Yummy yummy",
        "Delicious  ",
        "Very nice ",
        "Nice😊",
        "بحبك ",
        "Nice",
        "That looks good to eat",
        "Good morning",
        "Nice",
        "Nice",
        "Very good nice👍👏",
        "Yummy..very delicious",
        "Yummy..very delicious",
        "ok",
        "What a dish",
        "good presentation...",
        "Hi dipali",
        "Yummy..very delicious",
        "Nice wo",
        "Çok güzel",
        "Nice ",
        "Looks delicious ",
        "NİCE",
        "Nice",
        "Nice",
        "Niec",
        "Nice",
        "Indian.. ..cookin",
        "Very sweet testy",
        "Delicious I have tried it🍋",
        "UPENDAR YADAV BAPPI \n\n",
        "http://wwww.upendaryadavbappi.com"
    ]
};

Helper.init();
