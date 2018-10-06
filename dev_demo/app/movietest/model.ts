import { Observable } from 'data/observable';
import { ObservableArray } from "data/observable-array";
import * as http from 'http';
// import { LoadingIndicator } from "nativescript-loading-indicator";
// const imageModule = require("nativescript-image");

export interface MovieItem {
    id?: number;
    video?: boolean;
    vote_average?: number;
    title?: string;
    popularity?: number;
    poster_path?: string;
    original_language?: string;
    original_title?: string;
    genre_ids?: number[];
    big_backdrop_path?: string;
    backdrop_path?: string;
    adult?: boolean;
    overview?: string;
    release_date?: string;
    template?: string;
    trailerItems?: ObservableArray<MovieItem>;
}

function prepareMovieItem(result: MovieItem) {
    const backdrop_path = result.backdrop_path;
    result.backdrop_path = `https://image.tmdb.org/t/p/w500/${backdrop_path}`;
    result.big_backdrop_path = `https://image.tmdb.org/t/p/w1280/${backdrop_path}`;
    result.poster_path = `https://image.tmdb.org/t/p/w500/${result.poster_path}`;
    return result;
}
export class Model extends Observable  {
    currentPage = 1;
    // loader: LoadingIndicator
    constructor() {
        super();
        this.dataItems = new ObservableArray<MovieItem>();
        this.trailerItems = new ObservableArray<MovieItem>();
        this.dataItems.push({ template: 'trailers', trailerItems: this.trailerItems }); //trailers
        // this._templateSelector = this.templateSelectorFunction;
        // this.loader = new LoadingIndicator();

    }

    

    refresh() {
        console.log('refresh');
        // var options = {
        //     message: 'Loading...',
        //     android: {
        //         indeterminate: true,
        //         cancelable: false
        //     },
        //     ios: {
        //         margin: 10,
        //         dimBackground: true,
        //         userInteractionEnabled: false, // default true. Set false so that the touches will fall through it.
        //         hideBezel: true // default false, can hide the surrounding bezel
        //     }
        // };

        // this.loader.show(options); // options is optional
        return http
            .getJSON(
                `https://api.themoviedb.org/3/discover/movie?api_key=2d06dfd032252c2f28640c29b6f0b067&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=true&page=${
                    this.currentPage
                }`
            )
            .then(
                (r: any) => {
                    console.log('got data', r.results.length, this.dataItems.length);
                    // this.dataItems.addSection(r.results.map((result: MovieItem) => prepareMovieItem(result)))
                    // r.results.forEach((result: MovieItem) => {
                    //     console.log('adding item', result.title);
                    //     this.dataItems.push(prepareMovieItem(result));
                    // });
                    this.dataItems.push(r.results.map((result: MovieItem) => prepareMovieItem(result)));
                    // this.loader.hide();
                },
                function(e) {
                    //// Argument (e) is Error!
                    console.log(e);
                    // this.loader.hide();
                }
            );
    }

    refreshLatest() {
        return http
            .getJSON(`https://api.themoviedb.org/3/movie/now_playing?api_key=2d06dfd032252c2f28640c29b6f0b067&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=true&page=1`)
            .then((r: any) => {
                // this.trailerItems.addSection(r.results.map((result: MovieItem) => prepareMovieItem(result)))
                console.log('got trailers', r.results.length);
                // r.results.forEach((result: MovieItem) => {
                //     this.trailerItems.push(prepareMovieItem(result));
                // });
                this.trailerItems.push(r.results.map((result: MovieItem) => prepareMovieItem(result)));
                // this.loader.hide();
            });
    }

    get dataItems(): ObservableArray<MovieItem> {
        return this.get('_dataItems');
    }

    set dataItems(value: ObservableArray<MovieItem>) {
        this.set('_dataItems', value);
    }
    get trailerItems(): ObservableArray<MovieItem> {
        return this.get('_trailerItems');
    }

    set trailerItems(value: ObservableArray<MovieItem>) {
        this.set('_trailerItems', value);
    }

    // get _templateSelector(): (item: MovieItem, index: number, items: any) => string {
    //     return this.get("templateSelector");
    // }

    // set _templateSelector(value: (item: MovieItem, index: number, items: any) => string) {
    //     this.set("templateSelector", value);
    // }

    // public templateSelectorFunction = (item: MovieItem, index: number, items: any) => {
    //     console.log('templateSelectorFunction', index);
    //     if (index === 0) {
    //         return "trailers"
    //     }
    //     return "default";
    // }

    // private getType(index: number, end: number): string {
    //     if (index === 0) {
    //         return "trailer"
    //     }
    //     return "default";
    // }
    // loadMoreTimer
    public onLoadMoreItemsRequested(args) {
        // if (loadMoreTimer) {
        //     return;
        // }
        // console.log('onLoadMoreItemsRequested', args);
        const listView = args.object;
        this.currentPage += 1;
        // listView.notifyLoadOnDemandFinished();
        // }, 1000);
        args.returnValue = true;
        this.refresh();
        // var that = new WeakRef(this);
        // timer.setTimeout(function() {
    }
}
