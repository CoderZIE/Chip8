#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>

#include <SDL.h>

typedef struct {
    SDL_Window *window;
}sdl_t;

//initialize SDL
bool init_sdl(void){
    if (SDL_Init(SDL_INIT_VIDEO | SDL_INIT_AUDIO| SDL_INIT_TIMER) != 0){
        SDL_Log("Unable to initialize SDL: %s \n", SDL_GetError());
        return false;
    }
    return true; //success
}

//Final cleanup
void cleanup(void){
    // SDL_DestroyWindow(window); //destroy window
    SDL_Quit(); //shut down SDL
}

int main(int argc, char **argv){

    (void)argc;
    (void)argv;

    //Initialize SDL
    // sdl_t sdl ={0};
    if (!init_sdl()){
        return EXIT_FAILURE;
    }

    //Final cleanup
    cleanup();

    puts("Hello, World!");

    exit(EXIT_SUCCESS);
    

    return 0;
}

