import { defaultPlants } from "../../demoData/defaultPlants.js ";
import { defaultDistillations } from "../../demoData/defaultDistillations.js ";
import { defaultArchives } from "../../demoData/defaultArchives.js ";

//function used in mongodb atlas as trigger function
const resetDemoData = async () => {
  const cluster = context.services.get("Cluster0");
  const db = cluster.db("destill");
  const usersCollection = db.collection("users");
  const settingsCollection = db.collection("usersettings");
  const plantsCollection = db.collection("plants");
  const distillationCollection = db.collection("distillations");
  const archivesCollection = db.collection("distillationarchives");

  try {
    const demoUser = await usersCollection.findOne({ username: "DemoUser" });
    if (!demoUser) {
      console.log("❌ demoUser not found");
      return;
    }
    const userId = demoUser._id;

    //settings
    const deleteResult = await settingsCollection.deleteMany({
      userId: userId,
    });
    console.log(`🗑️ Deleted ${deleteResult.deletedCount} existing settings`);

    const { ObjectId } = BSON;
    const defaultSettings = {
      userId: userId,
      listSettings: {
        plantListLength: 10,
        distillationListLength: 10,
        distillationArchivesListLength: 10,
      },
      listSorting: {
        plantListSorting: "createdAt",
        distillationListSorting: "createdAt",
        archiveDistillationListSorting: "createdAt",
      },
      distillerList: [
        {
          _id: new ObjectId(),
          material: "stal nierdzewna",
          capacity: 200,
          heating: "gaz",
        },
        {
          _id: new ObjectId(),
          material: "stal nierdzewna",
          capacity: 100,
          heating: "prąd",
        },
        {
          _id: new ObjectId(),
          material: "miedź",
          capacity: 80,
          heating: "gaz",
        },
      ],
      isDarkTheme: false,
      updatedAt: new Date(),
    };
    await settingsCollection.insertOne(defaultSettings);

    //plants
    const deletePlants = await plantsCollection.deleteMany({ userId: userId });
    console.log(
      `🗑️ Deleted ${deletePlants.deletedCount} existing plants`
    );
    await plantsCollection.insertMany(defaultPlants);

    //distillations
    const deleteDistillations = await distillationCollection.deleteMany({
      userId: userId,
    });
    console.log(
      `🗑️ Deleted ${deleteDistillations.deletedCount} existing distillations`
    );

    await distillationCollection.insertMany(defaultDistillations);

    //archives
    const deleteArchives = await archivesCollection.deleteMany({
      userId: userId,
    });
    console.log(`🗑️ Deleted ${deleteArchives.deletedCount} existing archives`);

    await archivesCollection.insertMany(defaultArchives);
  } catch (err) {
    console.log("⚠️ Error resetting user settings:", err.message);
  }
};
