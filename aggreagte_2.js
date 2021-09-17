db.students.aggregate([
    {
        $group : {
            _id : {
                class : "$class"
            },
            allSubjects : {
                $push : "$marks.theory"
            }
        }
    }
]).pretty()

db.students.aggregate([
    {
        $group : {
            _id : {
                class : "$class"
            },
            allSubjects : {
                $push : "$subjects"
            }
        }
    }
]).pretty()


db.students.aggregate([
    { $unwind : "$subjects"},
    {
        $group : {
            _id : {
                class : "$class"
            },
            allSubjects : {
                $push : "$subjects"
            }
        }
    }
]).pretty()


db.students.aggregate([
    { $unwind : "$subjects"},
    {
        $group : {
            _id : {
                class : "$class"
            },
            allSubjects : {
                $addToSet : "$subjects"
            }
        }
    }
]).pretty()

// first subject marks
db.students.aggregate([
    {
        $project : {
            _id : 0,
            name : 1,
            subject : {
                $slice : ["$subjects",1]
            },
            examScore : {
                $slice : ["$marks", 1]
            }
        }
    }
]).pretty()

// last 2 subjects
db.students.aggregate([
    {
        $project : {
            _id : 0,
            name : 1,
            subject : {
                $slice : ["$subjects",-2]
            },
            examScore : {
                $slice : ["$marks", -2]
            }
        }
    }
]).pretty()


// 2nd subject marks
db.students.aggregate([
    {
        $project : {
            _id : 0,
            name : 1,
            subject : {
                $slice : ["$subjects",1,1]
            },
            examScore : {
                $slice : ["$marks", 1,1]
            }
        }
    }
]).pretty()


// Array Length
db.students.aggregate([
    {
        $project : {
            _id : 0,
            name : 1,
            len : {
                $size : "$subjects"
            }
        }
    }
]).pretty()

// Using filter
db.students.aggregate([
    {
        $project : {
            _id : 0,
            examScore : {
                $filter : {
                    input : "$marks",
                    as : "x",
                    cond : {
                        $gt : ["$$x.theory", 85]
                    }
                }
            }
        }
    }
]).pretty()


// Mutliple Array Operations
db.students.aggregate([
    {$unwind : "$marks"},
    {$project : {_id : 1, name : 1, rollno : 1, score : "$marks.theory"}},
    {$sort : {score : -1}},
    {$group : {_id : "$_id", name : {$first : "$name"}, maxScore : {$max : "$score"}}},
    {$sort : {maxScore : -1}}
]).pretty()