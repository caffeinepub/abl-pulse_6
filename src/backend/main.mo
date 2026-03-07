import Map "mo:core/Map";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";

actor {
  type HealthSeekerRecord = {
    id : Nat;
    name : Text;
    gender : Text;
    age : Text;
    profession : Text;
    weight : Text;
    height : Text;
    bp : Text;
    sugar : Text;
    thyroid : Text;
    whatsapp : Text;
    email : ?Text;
    answers : [Nat];
    totalScore : Nat;
    sleepScore : Nat;
    gutScore : Nat;
    movementScore : Nat;
    mindScore : Nat;
    category : Text;
    submittedAt : Int;
  };

  var nextId : Nat = 1;
  var submissionsEntries : [(Nat, HealthSeekerRecord)] = [];

  let submissions : Map.Map<Nat, HealthSeekerRecord> = Map.fromIter<Nat, HealthSeekerRecord>(
    submissionsEntries.vals(),
  );

  func validateAnswers(answers : [Nat]) {
    if (answers.size() != 40) {
      Runtime.trap("Answers array must have exactly 40 elements");
    };
    for (a in answers.values()) {
      if (a >= 5) {
        Runtime.trap("Answers must be in the range 0-4");
      };
    };
  };

  func calculateScores(answers : [Nat]) : (Nat, Nat, Nat, Nat, Nat) {
    var total = 0;
    var sleep = 0;
    var gut = 0;
    var movement = 0;
    var mind = 0;

    for (i in Nat.range(0, 10)) {
      total += answers[i];
      sleep += answers[i];
    };

    for (i in Nat.range(10, 20)) {
      total += answers[i];
      gut += answers[i];
    };

    for (i in Nat.range(20, 30)) {
      total += answers[i];
      movement += answers[i];
    };

    for (i in Nat.range(30, 40)) {
      total += answers[i];
      mind += answers[i];
    };

    (total, sleep, gut, movement, mind);
  };

  func categorizeScore(score : Nat) : Text {
    if (score <= 69) {
      "needs_attention";
    } else if (score <= 89) {
      "building_zone";
    } else {
      "strong_area";
    };
  };

  public shared ({ caller }) func submitAssessment(
    name : Text,
    gender : Text,
    age : Text,
    profession : Text,
    weight : Text,
    height : Text,
    bp : Text,
    sugar : Text,
    thyroid : Text,
    whatsapp : Text,
    email : ?Text,
    answers : [Nat],
  ) : async Nat {
    validateAnswers(answers);

    let (totalScore, sleepScore, gutScore, movementScore, mindScore) = calculateScores(answers);

    let record : HealthSeekerRecord = {
      id = nextId;
      name;
      gender;
      age;
      profession;
      weight;
      height;
      bp;
      sugar;
      thyroid;
      whatsapp;
      email;
      answers;
      totalScore;
      sleepScore;
      gutScore;
      movementScore;
      mindScore;
      category = categorizeScore(totalScore);
      submittedAt = Time.now();
    };

    submissions.add(nextId, record);
    let resultId = nextId;
    nextId += 1;
    resultId;
  };

  public query ({ caller }) func getSubmissions() : async [HealthSeekerRecord] {
    submissions.values().toArray();
  };

  public query ({ caller }) func getSubmissionById(id : Nat) : async ?HealthSeekerRecord {
    submissions.get(id);
  };

  public shared ({ caller }) func deleteSubmission(id : Nat) : async Bool {
    if (submissions.containsKey(id)) {
      submissions.remove(id);
      true;
    } else {
      false;
    };
  };

  system func preupgrade() {
    submissionsEntries := submissions.entries().toArray();
  };

  system func postupgrade() {
    submissionsEntries := [];
  };
};
