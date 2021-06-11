import random
from hermesBot import Mages
# +-*/%^

# x = "hello"
# y = "world"
# z = 5

# print(x +str(z))


# < <= == > >=
# x = 1
# if x > 5:
#     print("Something")
# elif x == 1:
#     print("idek")
# else:
#     print("else")

# x = 0
# while x < 10:
#     print(x)
#     x += 1

# for x in range(10):
#     print(x)

# arr = [1,2,3,4,5,6,7,8,9]

# for x in range(len(arr)):
#     print(arr[x])


# randNum = random.randint(0,10)
# userinput = int(input("enter a number: "))
# while userinput != randNum:
#     if userinput > randNum:
#         print("guess lower")
#     else:
#         print("geuss higher")
#     userinput = int(input("geuss again: "))   
# print("correct number is" + str(randNum))

def winCheck(lettersUsed, word):
    for letter in word:
        if letter not in lettersUsed:
            return False
    return True


word = random.choice(Mages)
while word == "Chang\'e":
    word = random.choice(Mages)

word = word.lower()

lettersUsed = []
lettersCorrect = []
userGuess = ""
lifes = 10
print("the word has {} letters".format(len(word)))
while winCheck(lettersUsed, word) == False and lifes >= 0:
    letter = input("Guess a letter: ")
    while len(letter) > 1:
        input("Guess Too long: ")
    if letter not in lettersUsed:
        lettersUsed.append(letter)
        if letter not in word:
            lifes -= 1
            print("{} is not in word \n you now have {} lives".format(letter, lifes))
        else:
            lettersCorrect.append(letter)
            letterCount = word.count(letter)
            print("{} is in word {} times".format(letter, letterCount))
    else:
        print("Already Guessed {}".format(letter))

    print("in word: {}".format(lettersCorrect))
    print("Letters Guessed Already: {}".format(lettersUsed))

print("{} is the word".format(word))
