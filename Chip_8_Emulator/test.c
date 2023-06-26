#include<stdio.h>
#include<stdlib.h>
#include<string.h>
#include<stddef.h>

#pragma pack(push,2)
struct student {
    //dynamically alloting the bits to main
   
   
   
   char a;
   short int b;
   int c;
   long long int d;
};

int main(){

    struct student A;

    //printing the size of struct student
    printf("%d \n", sizeof(A));
    
    printf("A%d ", offsetof(struct student,a));
    printf("B%d ", offsetof(struct student,b));
    printf("C%d ", offsetof(struct student,c));
    // printf("D%d ", offsetof(struct student,d));


    return 0;
}