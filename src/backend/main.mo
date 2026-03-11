import Map "mo:core/Map";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Array "mo:core/Array";
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

  type HCRecord = {
    id : Nat;
    name : Text;
    mobile : Text;
    email : Text;
    password : Text;
    experienceMonths : Text;
    fieldExpertise : Text;
    currentWorking : Text;
    socialMedia : Text;
    status : Text;
    registeredAt : Int;
  };

  stable var nextId : Nat = 1;
  stable var submissionsStable : [(Nat, HealthSeekerRecord)] = [];
  stable var nextHCId : Nat = 1;
  stable var hcStable : [(Nat, HCRecord)] = [];

  var submissions = Map.empty<Nat, HealthSeekerRecord>();
  var hcRecords = Map.empty<Nat, HCRecord>();

  system func preupgrade() {
    submissionsStable := submissions.entries().toArray();
    hcStable := hcRecords.entries().toArray();
  };

  system func postupgrade() {
    for ((k, v) in submissionsStable.vals()) {
      submissions.add(k, v);
    };
    for ((k, v) in hcStable.vals()) {
      hcRecords.add(k, v);
    };
  };

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
    if (score <= 65) {
      "needs_attention";
    } else if (score <= 116) {
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

    nextId += 1;
    record.id;
  };

  public shared ({ caller }) func saveBasicInfo(
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
  ) : async Nat {
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
      answers = Array.tabulate<Nat>(40, func(_) { 0 });
      totalScore = 0;
      sleepScore = 0;
      gutScore = 0;
      movementScore = 0;
      mindScore = 0;
      category = "incomplete";
      submittedAt = Time.now();
    };

    submissions.add(nextId, record);
    nextId += 1;
    record.id;
  };

  public shared ({ caller }) func updateAssessmentResult(id : Nat, answers : [Nat]) : async Bool {
    validateAnswers(answers);

    let record = submissions.get(id);
    switch (record) {
      case (null) { false };
      case (?existing) {
        let (totalScore, sleepScore, gutScore, movementScore, mindScore) = calculateScores(answers);
        let updatedRecord = {
          existing with
          answers;
          totalScore;
          sleepScore;
          gutScore;
          movementScore;
          mindScore;
          category = categorizeScore(totalScore);
        };
        submissions.add(id, updatedRecord);
        true;
      };
    };
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

  // ── HC Functions ──────────────────────────────────────────────

  public shared ({ caller }) func registerHC(
    name : Text,
    mobile : Text,
    email : Text,
    password : Text,
    experienceMonths : Text,
    fieldExpertise : Text,
    currentWorking : Text,
    socialMedia : Text,
  ) : async { #ok : Nat; #err : Text } {
    // Check duplicate email
    for ((_, hc) in hcRecords.entries()) {
      if (hc.email == email) {
        return #err("Email already registered.");
      };
    };

    let record : HCRecord = {
      id = nextHCId;
      name;
      mobile;
      email;
      password;
      experienceMonths;
      fieldExpertise;
      currentWorking;
      socialMedia;
      status = "PENDING";
      registeredAt = Time.now();
    };

    hcRecords.add(nextHCId, record);
    nextHCId += 1;
    #ok(record.id);
  };

  public query ({ caller }) func loginHC(email : Text, password : Text) : async { #ok : HCRecord; #err : Text } {
    for ((_, hc) in hcRecords.entries()) {
      if (hc.email == email) {
        if (hc.password != password) {
          return #err("INVALID");
        };
        if (hc.status == "PENDING") {
          return #err("PENDING");
        };
        if (hc.status == "REJECTED") {
          return #err("REJECTED");
        };
        return #ok(hc);
      };
    };
    #err("INVALID");
  };

  public query ({ caller }) func getHCRequests() : async [HCRecord] {
    hcRecords.values().filter(func(hc : HCRecord) : Bool { hc.status == "PENDING" }).toArray();
  };

  public query ({ caller }) func getApprovedHCs() : async [HCRecord] {
    hcRecords.values().filter(func(hc : HCRecord) : Bool { hc.status == "ACTIVE" }).toArray();
  };

  public shared ({ caller }) func approveHC(id : Nat) : async { #ok : Bool; #err : Text } {
    switch (hcRecords.get(id)) {
      case (null) { #err("HC not found.") };
      case (?hc) {
        let updated = { hc with status = "ACTIVE" };
        hcRecords.add(id, updated);
        #ok(true);
      };
    };
  };

  public shared ({ caller }) func rejectHC(id : Nat) : async { #ok : Bool; #err : Text } {
    switch (hcRecords.get(id)) {
      case (null) { #err("HC not found.") };
      case (?hc) {
        let updated = { hc with status = "REJECTED" };
        hcRecords.add(id, updated);
        #ok(true);
      };
    };
  };

  public query ({ caller }) func getHCById(id : Nat) : async ?HCRecord {
    hcRecords.get(id);
  };
};
